// ── NAV scroll state ─────────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
    document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });


// ── BRAIN scroll activation ───────────────────────────────────────────────────
const regionMap = {
    hippocampus: {
        region: 'r-hippocampus',
        paths:  ['np-hv','np-ph'],
        label:  'Hippocampus — spatial memory anchor'
    },
    visual: {
        region: 'r-visual',
        paths:  ['np-hv','np-vp'],
        label:  'Visual cortex — imagery encoding'
    },
    prefrontal: {
        region: 'r-prefrontal',
        paths:  ['np-vp','np-ph'],
        label:  'Prefrontal cortex — deliberate association'
    },
    parahippo: {
        region: 'r-parahippo',
        paths:  ['np-pl'],
        label:  'Parahippocampal cortex — scene context'
    },
    none: {
        region: null,
        paths:  [],
        label:  'The brain at rest'
    }
};

function activateRegion(key) {
    const cfg = regionMap[key] || regionMap.none;

    // clear all regions
    document.querySelectorAll('.b-region').forEach(el => el.classList.remove('active'));
    // clear all paths
    document.querySelectorAll('.b-paths path').forEach(el => el.classList.remove('lit'));
    // clear legend
    document.querySelectorAll('.leg-item').forEach(el => el.classList.remove('active'));

    // apply
    if (cfg.region) {
        const r = document.getElementById(cfg.region);
        if (r) r.classList.add('active');
        cfg.paths.forEach(pid => {
            const p = document.getElementById(pid);
            if (p) p.classList.add('lit');
        });
        // match legend
        document.querySelectorAll('.leg-item').forEach(el => {
            if (el.dataset.r === key) el.classList.add('active');
        });
    }

    document.getElementById('brain-label').textContent = cfg.label;
}

// Scroll-driven block activation
const blocks = document.querySelectorAll('.brain-block');

const blockObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            const region = entry.target.dataset.region;
            if (region) activateRegion(region);
        }
    });
}, { threshold: 0.4 });

blocks.forEach(b => blockObserver.observe(b));

// Legend manual clicks
document.querySelectorAll('.leg-item').forEach(btn => {
    btn.addEventListener('click', () => activateRegion(btn.dataset.r));
});

// Brain region SVG clicks
document.querySelectorAll('.b-region').forEach(r => {
    r.addEventListener('click', () => {
        // map SVG id → data key
        const id = r.id; // e.g. "r-hippocampus"
        const key = id.replace('r-', '').replace('-', '');
        // find matching regionMap key
        const match = Object.keys(regionMap).find(k =>
            regionMap[k].region === id
        );
        if (match) activateRegion(match);
    });
});


// ── DATA ─────────────────────────────────────────────────────────────────────
const ITEMS = [
    { item: 'coffee',       location: 'alarm',    img: 'https://i.imgur.com/4P0gc6C.png' },
    { item: 'orange',       location: 'floor',    img: 'https://i.imgur.com/79wOLGV.png' },
    { item: 'almonds',      location: 'light',    img: 'https://i.imgur.com/Xjawb4H.png' },
    { item: 'garbage bags', location: 'window',   img: 'https://i.imgur.com/oNcfEnv.png' },
    { item: 'batteries',    location: 'bathroom', img: 'https://i.imgur.com/GKmEb83.png' },
    { item: 'ice cream',    location: 'sink',     img: 'https://i.imgur.com/cHRNPuG.png' },
    { item: 'milk',         location: 'drawer',   img: 'https://i.imgur.com/P6CCvCF.png' },
    { item: 'bread',        location: 'ceiling',  img: 'https://i.imgur.com/of1Aur8.png' },
    { item: 'popcorn',      location: 'door',     img: 'https://i.imgur.com/WLS5JSM.png' },
    { item: 'carrots',      location: 'fence',    img: 'https://i.imgur.com/j68ynSn.png' },
];

const SENTENCES = {
    'coffee':       `As you reach to turn off the <strong>alarm</strong>, you find <strong>coffee</strong> spilling out of it.`,
    'orange':       `You walk onto the <strong>floor</strong> and step on an <strong>orange</strong>.`,
    'almonds':      `You switch on the <strong>light</strong> and <strong>almonds</strong> rain down from the bulb.`,
    'garbage bags': `You glance at the <strong>window</strong> and see it wrapped in black <strong>garbage bags</strong>.`,
    'batteries':    `You walk into the <strong>bathroom</strong> and the whole room is packed with <strong>batteries</strong>.`,
    'ice cream':    `You turn on the <strong>sink</strong> and thick, cold <strong>ice cream</strong> pours out.`,
    'milk':         `You open a <strong>drawer</strong> and it is stacked full of cartons of <strong>milk</strong>.`,
    'bread':        `You look up at the <strong>ceiling</strong> and a giant loaf of <strong>bread</strong> is plastered there.`,
    'popcorn':      `You open the front <strong>door</strong> and a wall of <strong>popcorn</strong> tumbles in.`,
    'carrots':      `You look at the backyard <strong>fence</strong> and every plank has turned into a <strong>carrot</strong>.`,
};

const ALL_GROCERIES = [
    'Almonds','Apples','Avocados','Bagels','Bananas',
    'Batteries','Beans','Berries','Bread','Broccoli',
    'Butter','Carrots','Cereal','Cheese','Chicken',
    'Coffee','Cookies','Crackers','Eggs','Fish',
    'Garbage bags','Garlic','Honey','Hot sauce','Ice cream',
    'Juice','Ketchup','Lemons','Lettuce','Milk',
    'Mushrooms','Noodles','Olive oil','Onions','Orange',
    'Pasta','Popcorn','Rice','Soda','Yogurt',
];

const READER_DIST = [1,1,1,1,1,2,5,9,15,26,37];


// ── GAME STATE ────────────────────────────────────────────────────────────────
let currentIdx  = 0;
let selected    = new Set();
let score       = 0;
let submitted   = false;


// ── LAUNCH / CLOSE ────────────────────────────────────────────────────────────
function launchGame() {
    currentIdx = 0;
    document.body.style.overflow = 'hidden';
    document.getElementById('game-overlay').classList.remove('hidden');
    showPhase('ph-study');
    renderItem();
    buildDots();
}

function closeGame() {
    document.getElementById('game-overlay').classList.add('hidden');
    document.body.style.overflow = '';
}

function showPhase(id) {
    ['ph-study','ph-ready','ph-quiz','ph-results'].forEach(p => {
        document.getElementById(p).classList.toggle('hidden', p !== id);
    });
}


// ── STUDY PHASE ───────────────────────────────────────────────────────────────
function renderItem() {
    const d = ITEMS[currentIdx];
    document.getElementById('game-display').innerHTML = `
    <div class="g-item">
      <div class="g-item-label">Item ${currentIdx + 1} of ${ITEMS.length}</div>
      <p class="g-item-sentence">${SENTENCES[d.item]}</p>
      <div class="g-item-img">
        <img src="${d.img}" alt="${d.item}"/>
      </div>
    </div>
  `;
    document.getElementById('item-counter').textContent =
        String(currentIdx + 1).padStart(2,'0') + ' / ' + String(ITEMS.length).padStart(2,'0');
    document.getElementById('btn-prev').disabled = currentIdx === 0;
    document.getElementById('btn-next').textContent = currentIdx === ITEMS.length - 1 ? '✓ Done' : '→';
    updateDots();
}

function buildDots() {
    const container = document.getElementById('g-dots');
    container.innerHTML = ITEMS.map((_,i) =>
        `<div class="g-dot${i === currentIdx ? ' active' : ''}"></div>`
    ).join('');
}

function updateDots() {
    document.querySelectorAll('.g-dot').forEach((d,i) =>
        d.classList.toggle('active', i === currentIdx)
    );
}

function prevItem() {
    if (currentIdx > 0) { currentIdx--; renderItem(); }
}

function nextItem() {
    if (currentIdx < ITEMS.length - 1) {
        currentIdx++;
        renderItem();
    } else {
        showPhase('ph-ready');
    }
}


// ── QUIZ PHASE ────────────────────────────────────────────────────────────────
function startQuiz() {
    selected  = new Set();
    submitted = false;
    buildQuizGrid();
    showPhase('ph-quiz');
}

function buildQuizGrid() {
    const grid = document.getElementById('quiz-grid');
    grid.innerHTML = '';
    ALL_GROCERIES.forEach(g => {
        const el = document.createElement('div');
        el.className     = 'quiz-item';
        el.textContent   = g;
        el.dataset.value = g.toLowerCase();
        el.addEventListener('click', () => handlePick(el));
        grid.appendChild(el);
    });
    document.getElementById('choose-label').textContent = 'Choose an item to begin.';
}

function handlePick(el) {
    if (submitted) return;
    const v = el.dataset.value;
    if (selected.has(v)) {
        selected.delete(v);
        el.classList.remove('selected');
    } else {
        if (selected.size >= 10) return;
        selected.add(v);
        el.classList.add('selected');
    }
    const rem = 10 - selected.size;
    const lbl = document.getElementById('choose-label');
    if (selected.size === 0)       lbl.textContent = 'Choose an item to begin.';
    else if (rem > 0)              lbl.textContent = `Choose ${rem} more item${rem !== 1 ? 's' : ''}.`;
    else {
        lbl.textContent = 'All 10 selected — see your results.';
        submitQuiz();
    }
}

function submitQuiz() {
    if (submitted) return;
    submitted = true;
    const correct = new Set(ITEMS.map(i => i.item.toLowerCase()));
    score = 0;
    document.querySelectorAll('.quiz-item').forEach(el => {
        const v = el.dataset.value;
        const isC = correct.has(v);
        const wasSel = selected.has(v);
        el.classList.remove('selected');
        if      (wasSel && isC)  { el.classList.add('correct'); score++; }
        else if (wasSel && !isC) { el.classList.add('wrong'); }
        else if (!wasSel && isC) { el.classList.add('missed'); }
    });
    setTimeout(() => { buildResults(); showPhase('ph-results'); }, 800);
}


// ── RESULTS ───────────────────────────────────────────────────────────────────
function buildResults() {
    document.getElementById('results-headline').textContent = `You remembered ${score} / 10.`;

    const chartDiv = document.getElementById('bar-chart');
    const xRow     = document.getElementById('bar-x-row');
    chartDiv.innerHTML = '';
    xRow.innerHTML     = '';

    const maxP = Math.max(...READER_DIST);
    READER_DIST.forEach((pct, i) => {
        const h     = Math.round((pct / maxP) * 90);
        const isYou = i === score;
        const col   = document.createElement('div');
        col.className = 'bar-col';
        col.innerHTML = `<span class="bar-pct">${pct}%</span><div class="bar${isYou ? ' you' : ''}" style="height:${h}px"></div>`;
        chartDiv.appendChild(col);
        const xc = document.createElement('div');
        xc.className = 'bar-x-col';
        xc.innerHTML = `<span class="bar-x">${i}</span>${isYou ? '<span class="you-label">You</span>' : ''}`;
        xRow.appendChild(xc);
    });

    const listStr = ITEMS.map(it => `<strong>${it.item}</strong> (${it.location})`).join(', ');
    document.getElementById('results-body').innerHTML = `
    <p>You got <strong>${score} out of 10</strong> correct.</p>
    ${score < 10
        ? `<p>The full list: ${listStr}.</p>`
        : '<p>Perfect score. Your palace is formidable.</p>'
    }
    <p>The most effective memory palace uses places you know by heart. The more familiar the path, the stronger the recall.</p>
  `;
}


// ── RESET ─────────────────────────────────────────────────────────────────────
function resetGame() {
    currentIdx = 0;
    selected   = new Set();
    score      = 0;
    submitted  = false;
    showPhase('ph-study');
    renderItem();
    buildDots();
}