// ─── SCROLL ENGINE ────────────────────────────────────────────────────────────
const wrapper  = document.getElementById("wrapper");
const progress = document.getElementById("progress");
const counter  = document.getElementById("counter");

const TOTAL_PANELS = 11;

let current = 0;
let target  = 0;
const ease  = 0.08;

function maxScroll() {
    return wrapper.scrollWidth - window.innerWidth;
}

function updateUI() {
    const percent = Math.abs(target) / maxScroll();
    progress.style.width = (percent * 100) + "%";

    const page = Math.round(Math.abs(target) / window.innerWidth) + 1;
    counter.textContent = String(page).padStart(2, "0") + " / " + String(TOTAL_PANELS).padStart(2, "0");
}

function animate() {
    current += (target - current) * ease;
    if (Math.abs(target - current) < 0.05) current = target;
    wrapper.style.transform = `translateX(${current}px)`;
    requestAnimationFrame(animate);
}
animate();

window.addEventListener("wheel", (e) => {
    target -= e.deltaY * 2.5;
    target = Math.max(-maxScroll(), Math.min(0, target));
    updateUI();
}, { passive: true });

window.addEventListener("keydown", (e) => {
    const step = 800;
    if (e.key === "ArrowRight") target -= step;
    if (e.key === "ArrowLeft")  target += step;
    target = Math.max(-maxScroll(), Math.min(0, target));
    updateUI();
});

let touchStartX = 0;
window.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
}, { passive: true });
window.addEventListener("touchmove", (e) => {
    const dx = touchStartX - e.touches[0].clientX;
    target -= dx * 1.5;
    target = Math.max(-maxScroll(), Math.min(0, target));
    touchStartX = e.touches[0].clientX;
    updateUI();
}, { passive: true });

window.addEventListener("resize", () => {
    target = Math.max(-maxScroll(), Math.min(0, target));
    updateUI();
});

function snapToPanel(idx) {
    target = -(idx * window.innerWidth);
    target = Math.max(-maxScroll(), Math.min(0, target));
    updateUI();
}

updateUI();


// ─── DATA ─────────────────────────────────────────────────────────────────────
const ITEMS = [
    { item: "coffee",       location: "alarm",    img: "https://i.imgur.com/4P0gc6C.png"} ,
    { item: "orange",      location: "floor",    img: "https://i.imgur.com/79wOLGV.png"} ,
    { item: "almonds",      location: "light",    img: "https://i.imgur.com/Xjawb4H.png"} ,
    { item: "garbage bags", location: "window",   img: "https://i.imgur.com/oNcfEnv.png"} ,
    { item: "batteries",    location: "bathroom", img: "https://i.imgur.com/GKmEb83.png"} ,
    { item: "ice cream",    location: "sink",     img: "https://i.imgur.com/cHRNPuG.png"} ,
    { item: "milk",         location: "drawer",   img: "https://i.imgur.com/P6CCvCF.png"} ,
    { item: "bread",        location: "ceiling",  img: "https://i.imgur.com/of1Aur8.png"} ,
    { item: "popcorn",      location: "door",     img: "https://i.imgur.com/WLS5JSM.png"} ,
    { item: "carrots",      location: "fence",    img: "https://i.imgur.com/j68ynSn.png"} ,
];

const SENTENCES = {
    "coffee":       `As you reach to turn off the <strong>alarm</strong>, you find <strong>coffee</strong> spilling out of it.`,
    "diapers":      `You step onto the <strong>floor</strong> and slip on a pile of <strong>diapers</strong>.`,
    "almonds":      `You switch on the <strong>light</strong> and <strong>almonds</strong> rain down from the bulb.`,
    "garbage bags": `You glance at the <strong>window</strong> and see it wrapped in black <strong>garbage bags</strong>.`,
    "batteries":    `You walk into the <strong>bathroom</strong> and the whole room is packed with <strong>batteries</strong>.`,
    "ice cream":    `You turn on the <strong>sink</strong> and thick, cold <strong>ice cream</strong> pours out.`,
    "milk":         `You open a <strong>drawer</strong> and it is stacked full of cartons of <strong>milk</strong>.`,
    "bread":        `You look up at the <strong>ceiling</strong> and a giant loaf of <strong>bread</strong> is plastered there.`,
    "popcorn":      `You open the front <strong>door</strong> and a wall of <strong>popcorn</strong> tumbles in.`,
    "carrots":      `You look at the backyard <strong>fence</strong> and every plank has turned into a <strong>carrot</strong>.`,
};

const ALL_GROCERIES = [
    "Air freshener", "Almonds",      "Aluminum foil",  "Apples",          "Asparagus",
    "Avocados",      "Orange",        "Bagels",         "Baking powder",   "Bananas",
    "Bandages",      "Basil",        "Batteries",      "BBQ sauce",       "Beans",
    "Beer",          "Berries",      "Black pepper",   "Bleach",          "Bread",
    "Bread crumbs",  "Broccoli",     "Buns",           "Burgers",         "Burritos",
    "Butter",        "Cake mix",     "Carrots",        "Cauliflower",     "Celery",
    "Cereal",        "Champagne",    "Cheese",         "Cherries",        "Chicken",
    "Cilantro",      "Cinnamon",     "Coffee",         "Cookies",         "Corn",
    "Crab",          "Crackers",     "Cucumbers",      "Detergent",       "Diapers",
    "Donuts",        "Eggplant",     "Eggs",           "English muffins", "Facial tissue",
    "Fish",          "Floss",        "Flour",          "Fries",           "Garbage bags",
    "Garlic",        "Granola",      "Ground beef",    "Ham",             "Honey",
    "Hot dogs",      "Hot sauce",    "Ice cream",      "Ice",             "Jam",
    "Juice",         "Ketchup",      "Lemons",         "Lettuce",         "Limes",
    "Mayonnaise",    "Milk",         "Mushrooms",      "Mustard",         "Noodles",
    "Olive oil",     "Onions",       "Oranges",        "Pasta",           "Peanut butter",
    "Peppers",       "Pickles",      "Popcorn",        "Potatoes",        "Rice",
    "Salsa",         "Shrimp",       "Soap",           "Soda",            "Sour cream",
    "Spinach",       "Strawberries", "Sugar",          "Tomatoes",        "Tortillas",
    "Tuna",          "Vinegar",      "Waffles",        "Yogurt",          "Zucchini",
];

const READER_DIST = [1, 1, 1, 1, 1, 2, 5, 9, 15, 26, 37];


// ─── GAME STATE ───────────────────────────────────────────────────────────────
let currentItemIdx  = 0;
let selectedAnswers = new Set();
let score           = 0;
let quizSubmitted   = false;


// ─── GAME ─────────────────────────────────────────────────────────────────────
function startGame() {
    currentItemIdx = 0;
    renderGameItem();
    snapToPanel(7); // Panel 8 (0-indexed)
}

function renderGameItem() {
    const d    = ITEMS[currentItemIdx];
    const dots = ITEMS.map((_, i) =>
        `<div class="dot ${i === currentItemIdx ? "active" : ""}"></div>`
    ).join("");

    document.getElementById("game-inner").innerHTML = `
        <div class="item-label">Item ${currentItemIdx + 1} of ${ITEMS.length}</div>
        <p class="item-sentence">${SENTENCES[d.item]}</p>
        <div class="item-illo">
    <img src="${d.img}" alt="${d.item}" />
</div>
        <div class="item-nav">
            <button onclick="prevItem()" ${currentItemIdx === 0 ? "disabled" : ""}>&#8592;</button>
            <span class="item-counter">${String(currentItemIdx + 1).padStart(2, "0")} / ${String(ITEMS.length).padStart(2, "0")}</span>
            <button onclick="nextItem()">&#8594;</button>
        </div>
        <div class="progress-dots">${dots}</div>
    `;
}

function prevItem() {
    if (currentItemIdx > 0) {
        currentItemIdx--;
        renderGameItem();
    }
}

function nextItem() {
    if (currentItemIdx < ITEMS.length - 1) {
        currentItemIdx++;
        renderGameItem();
    } else {
        snapToPanel(8); // Panel 9 — end of list
    }
}


// ─── QUIZ ─────────────────────────────────────────────────────────────────────
function buildQuiz() {
    if (quizSubmitted) return;
    selectedAnswers = new Set();

    const grid = document.getElementById("quiz-grid");
    grid.innerHTML = "";

    ALL_GROCERIES.forEach(g => {
        const el = document.createElement("div");
        el.className     = "quiz-item";
        el.textContent   = g;
        el.dataset.value = g.toLowerCase();

        el.addEventListener("click", () => {
            if (quizSubmitted) return;
            const v = el.dataset.value;

            if (selectedAnswers.has(v)) {
                selectedAnswers.delete(v);
                el.classList.remove("selected");
            } else {
                if (selectedAnswers.size >= 10) return;
                selectedAnswers.add(v);
                el.classList.add("selected");
            }

            const rem = 10 - selectedAnswers.size;
            const lbl = document.getElementById("choose-label");

            if (selectedAnswers.size === 0) {
                lbl.textContent = "Choose an item to begin.";
            } else if (rem > 0) {
                lbl.textContent = `Choose ${rem} more item${rem !== 1 ? "s" : ""}.`;
            } else {
                lbl.textContent = "All 10 selected — keep scrolling to see results.";
                submitQuiz();
            }
        });

        grid.appendChild(el);
    });
}

function submitQuiz() {
    if (quizSubmitted) return;
    quizSubmitted = true;

    const correct = new Set(ITEMS.map(i => i.item.toLowerCase()));
    score = 0;

    document.querySelectorAll(".quiz-item").forEach(el => {
        const v     = el.dataset.value;
        const isC   = correct.has(v);
        const wasSel = selectedAnswers.has(v);

        if      (wasSel && isC)  { el.classList.add("correct"); score++; }
        else if (wasSel && !isC) { el.classList.add("wrong"); }
        else if (!wasSel && isC) { el.classList.add("missed"); }

        el.classList.remove("selected");
    });

    buildResults();
}


// ─── RESULTS ──────────────────────────────────────────────────────────────────
function buildResults() {
    document.getElementById("results-headline").textContent =
        `You remembered ${score} / 10.`;

    const chartDiv = document.getElementById("bar-chart");
    const xRow     = document.getElementById("bar-x-row");
    chartDiv.innerHTML = "";
    xRow.innerHTML     = "";

    const maxP = Math.max(...READER_DIST);

    READER_DIST.forEach((pct, i) => {
        const h     = Math.round((pct / maxP) * 90);
        const isYou = i === score;

        const col = document.createElement("div");
        col.className = "bar-col";
        col.innerHTML = `
            <span class="bar-pct">${pct}%</span>
            <div class="bar${isYou ? " you" : ""}" style="height:${h}px"></div>
        `;
        chartDiv.appendChild(col);

        const xc = document.createElement("div");
        xc.className = "bar-x-col";
        xc.innerHTML = `
            <span class="bar-x">${i}</span>
            ${isYou ? '<span class="you-label">You</span>' : ""}
        `;
        xRow.appendChild(xc);
    });

    const missedStr = ITEMS
        .map(it => `<strong>${it.item}</strong> (${it.location})`)
        .join(", ");

    document.getElementById("results-body").innerHTML = `
        <p>You got <strong>${score} out of 10</strong> correct.</p>
        ${score < 10
        ? `<p>The full list was: ${missedStr}.</p>`
        : "<p>Perfect score. Your palace is formidable.</p>"
    }
        <p>The most effective memory palace uses places you know by heart — your own home, a daily route. The more familiar the path, the stronger the recall.</p>
    `;
}


// ─── RESET ────────────────────────────────────────────────────────────────────
function resetGame() {
    currentItemIdx  = 0;
    selectedAnswers = new Set();
    score           = 0;
    quizSubmitted   = false;
    buildQuiz();
    snapToPanel(6);
}


// ─── INIT ─────────────────────────────────────────────────────────────────────
buildQuiz();