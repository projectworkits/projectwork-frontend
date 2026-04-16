// Utenti salvati in localStorage da fare collegamento API


function getSession() {
  try { return JSON.parse(localStorage.getItem("doisneau_session")) || null; }
  catch { return null; }
}

function currentUser() { return getSession(); }
function isLoggedIn() { return !!getSession(); }
function getRole() 
{ 
  // const s = getSession(); return s ? s.role : "guest"; 
  return "admin"; // forzo l'essere admin, da cancellare dopo i test
}
function isAdmin() { return getRole() === "admin"; }
function isUser() { return getRole() === "user" || getRole() === "admin"; }

function setRole() { }
function renderRoleBadge() {
  const el = document.getElementById("role-select");
  if (el) el.value = getRole();
}

// ── NAV ACTIVE ──
function setActiveNav(id) {
  document.querySelectorAll(".nb-links a").forEach(a => {
    a.classList.toggle("active", a.dataset.page === id);
  });
}

// ── TOAST ──
function toast(msg, type = "success") {
  const t = document.createElement("div");
  t.className = `toast toast-${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add("visible"));
  setTimeout(() => { t.classList.remove("visible"); setTimeout(() => t.remove(), 400); }, 2800);
}

// ── FORMAT ──
function formatPrice(n) { return "€" + Number(n).toLocaleString("it-IT", { minimumFractionDigits: 0 }); }
function truncate(str, n) { return str && str.length > n ? str.slice(0, n) + "…" : str; }

function stateBadge(state) {
  const map = { disponibile: ["#4caf78", "Disponibile"], prenotata: ["#c8b482", "Prenotata"], venduta: ["#666", "Venduta"] };
  const [color, label] = map[state] || ["#999", state];
  return `<span class="state-badge" style="--bc:${color}">${label}</span>`;
}

// ── PAGINATION ──
function paginate(items, page, perPage) {
  const total = Math.ceil(items.length / perPage);
  const slice = items.slice((page - 1) * perPage, page * perPage);
  return { items: slice, total, page, perPage };
}

function renderPager(container, current, total, onChange) {
  container.innerHTML = "";
  if (total <= 1) return;
  const btn = (label, page, disabled, active) => {
    const b = document.createElement("button");
    b.className = "pager-btn" + (active ? " active" : "");
    b.textContent = label;
    b.disabled = disabled;
    b.onclick = () => onChange(page);
    return b;
  };
  container.appendChild(btn("‹", current - 1, current === 1, false));
  for (let i = 1; i <= total; i++) {
    if (total > 7 && Math.abs(i - current) > 2 && i !== 1 && i !== total) {
      if (i === current - 3 || i === current + 3) {
        const dots = document.createElement("span");
        dots.className = "pager-dots";
        dots.textContent = "…";
        container.appendChild(dots);
      }
      continue;
    }
    container.appendChild(btn(i, i, false, i === current));
  }
  container.appendChild(btn("›", current + 1, current === total, false));
}

// ── MODAL CONFIRM ──
function confirmDialog(msg) {
  return new Promise(resolve => {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
      <div class="modal-box">
        <p class="modal-msg">${msg}</p>
        <div class="modal-actions">
          <button class="btn-ghost" id="modal-cancel">Annulla</button>
          <button class="btn-danger" id="modal-confirm">Conferma</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add("visible"));
    const close = (val) => {
      overlay.classList.remove("visible");
      setTimeout(() => overlay.remove(), 300);
      resolve(val);
    };
    overlay.querySelector("#modal-cancel").onclick = () => close(false);
    overlay.querySelector("#modal-confirm").onclick = () => close(true);
    overlay.onclick = e => { if (e.target === overlay) close(false); };
  });
}

// Light Mode
function toggleTheme() {
  const body = document.body;
  const btn = document.getElementById("theme-toggle");
  body.classList.toggle("light-mode");
  if (btn) {
    btn.innerHTML = body.classList.contains("light-mode") ? "☾" : "☀";
    btn.title = body.classList.contains("light-mode") ? "Passa al tema scuro" : "Passa al tema chiaro";
  }
  localStorage.setItem("doisneau_theme", body.classList.contains("light-mode") ? "light" : "dark");
}

function applyTheme() {
  if (localStorage.getItem("doisneau_theme") === "light") {
    document.body.classList.add("light-mode");
    const btn = document.getElementById("theme-toggle");
    if (btn) { btn.innerHTML = "☾"; btn.title = "Passa al tema scuro"; }
  }
}

// ── INIT ──
document.addEventListener("DOMContentLoaded", () => {
  applyTheme();
});
