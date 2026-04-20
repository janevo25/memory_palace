const wrapper  = document.getElementById("wrapper");
const progress = document.getElementById("progress");
const counter  = document.getElementById("counter");

// Smooth scroll state
let current = 0;
let target  = 0;
const ease  = 0.08; // lerp factor — lower = smoother/slower

function maxScroll() {
    return wrapper.scrollWidth - window.innerWidth;
}

// Update progress bar and counter
function updateUI() {
    const percent = Math.abs(target) / maxScroll();
    progress.style.width = (percent * 100) + "%";

    const page = Math.round(Math.abs(target) / window.innerWidth) + 1;
    counter.textContent = String(page).padStart(2, "0") + " / 05";
}

// RAF animation loop with lerp
function animate() {
    current += (target - current) * ease;

    // Snap to avoid sub-pixel drift
    if (Math.abs(target - current) < 0.05) current = target;

    wrapper.style.transform = `translateX(${current}px)`;
    requestAnimationFrame(animate);
}
animate();

// Mouse wheel
window.addEventListener("wheel", (e) => {
    target -= e.deltaY * 2.5;
    target = Math.max(-maxScroll(), Math.min(0, target));
    updateUI();
}, { passive: true });

// Arrow keys
window.addEventListener("keydown", (e) => {
    const step = 800;
    if (e.key === "ArrowRight") target -= step;
    if (e.key === "ArrowLeft")  target += step;
    target = Math.max(-maxScroll(), Math.min(0, target));
    updateUI();
});

// Touch / swipe support
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

// Resize: keep position in bounds
window.addEventListener("resize", () => {
    target = Math.max(-maxScroll(), Math.min(0, target));
    updateUI();
});

// Init
updateUI();