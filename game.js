const PHRASE = "Hoppy Easter";

const LETTER_COLORS = [
  "#e74c3c", "#e67e22", "#f1c40f", "#2ecc71",
  "#1abc9c", "#3498db", "#9b59b6", "#e91e63",
  "#ff5722", "#00bcd4", "#8bc34a", "#ff9800"
];

let currentIndex = 0;
let gameComplete = false;

const egg        = document.getElementById("egg");
const banner     = document.getElementById("banner-letters");
const placeholder= document.getElementById("banner-placeholder");
const bunny      = document.getElementById("bunny");
const celebration= document.getElementById("celebration");
const hint       = document.getElementById("hint");

// ── Initial egg placement ──────────────────────────────────────
function placeEggCenter() {
  const eggW = egg.offsetWidth  || 110;
  const eggH = egg.offsetHeight || 130;
  egg.style.left = Math.round((window.innerWidth  - eggW) / 2) + "px";
  egg.style.top  = Math.round((window.innerHeight - eggH) / 2) + "px";
}

// ── Random egg placement (avoids banner) ──────────────────────
function moveEggRandom() {
  const eggW      = egg.offsetWidth  || 110;
  const eggH      = egg.offsetHeight || 130;
  const bannerH   = 80 + 12;           // banner height + small gap
  const padding   = 16;

  const maxX = window.innerWidth  - eggW  - padding;
  const minY = bannerH;
  const maxY = window.innerHeight - eggH  - padding;

  const x = padding + Math.random() * (maxX - padding);
  const y = minY    + Math.random() * (maxY - minY);

  egg.style.left = Math.round(x) + "px";
  egg.style.top  = Math.round(y) + "px";
}

// ── Add letter to banner ───────────────────────────────────────
function addLetter(index) {
  if (placeholder) placeholder.style.display = "none";

  const ch   = PHRASE[index];
  const span = document.createElement("span");
  span.textContent = ch === " " ? "\u00A0" : ch;
  span.className   = "banner-letter" + (ch === " " ? " space" : "");
  span.style.color = LETTER_COLORS[index % LETTER_COLORS.length];
  // Re-trigger animation on each new letter
  span.style.animationName = "none";
  banner.appendChild(span);
  // Force reflow then re-enable animation
  void span.offsetWidth;
  span.style.animationName = "";
}

// ── Confetti burst ─────────────────────────────────────────────
function spawnConfetti() {
  const colors = ["#ff6b6b","#ffd93d","#6bcb77","#4d96ff","#ff922b","#cc5de8"];
  for (let i = 0; i < 80; i++) {
    const el = document.createElement("div");
    el.className = "confetti";
    el.style.left            = Math.random() * 100 + "vw";
    el.style.top             = "-20px";
    el.style.background      = colors[Math.floor(Math.random() * colors.length)];
    el.style.width           = 6 + Math.random() * 10 + "px";
    el.style.height          = 6 + Math.random() * 10 + "px";
    el.style.animationDuration   = 1.8 + Math.random() * 2.4 + "s";
    el.style.animationDelay      = Math.random() * 1.2 + "s";
    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
}

// ── Trigger win sequence ───────────────────────────────────────
function triggerWin() {
  gameComplete = true;
  egg.classList.add("hidden");
  hint.classList.add("hidden");

  spawnConfetti();

  setTimeout(() => {
    bunny.classList.add("hopping");
    celebration.classList.add("visible");
  }, 400);
}

// ── Main click handler ─────────────────────────────────────────
egg.addEventListener("click", () => {
  if (gameComplete) return;

  addLetter(currentIndex);
  currentIndex++;

  if (currentIndex >= PHRASE.length) {
    triggerWin();
  } else {
    moveEggRandom();
  }
});

// ── Boot ───────────────────────────────────────────────────────
window.addEventListener("load", placeEggCenter);
window.addEventListener("resize", () => {
  if (!gameComplete) placeEggCenter();
});
