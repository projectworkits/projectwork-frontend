// ── SHARED APP UTILS ──

// ── AUTH / SESSION ──
// Utenti salvati in localStorage (in produzione: API + JWT)
// Struttura sessione: { id, name, email, role }

function getSession() {
  try { return JSON.parse(localStorage.getItem("doisneau_session")) || null; }
  catch { return null; }
}
function setSession(user) {
  localStorage.setItem("doisneau_session", JSON.stringify(user));
}
function clearSession() {
  localStorage.removeItem("doisneau_session");
}

function getRegisteredUsers() {
  try { return JSON.parse(localStorage.getItem("doisneau_users")) || []; }
  catch { return []; }
}
function saveRegisteredUsers(users) {
  localStorage.setItem("doisneau_users", JSON.stringify(users));
}

// Utenti di default (seed) — in produzione vengono dal backend
function seedUsers() {
  const existing = getRegisteredUsers();
  if (existing.length > 0) return;
  saveRegisteredUsers([
    { id: 1, name: "Admin Demo", email: "admin@demo.it", password: "admin123", role: "admin" },
    { id: 2, name: "Utente Demo", email: "utente@demo.it", password: "utente123", role: "user" },
  ]);
}
seedUsers();

// Shorthand helpers
function currentUser() { return getSession(); }
function isLoggedIn() { return !!getSession(); }
function getRole() { const s = getSession(); return s ? s.role : "guest"; }
function isAdmin() { return getRole() === "admin"; }
function isUser() { return getRole() === "user" || getRole() === "admin"; }

// Compatibilità con il vecchio sistema role-select (ora ignorato — usa la sessione)
function setRole() { } // no-op, tenuto per compatibilità
function renderRoleBadge() {
  const el = document.getElementById("role-select");
  if (el) el.value = getRole();
}

// ── AUTH ACTIONS ──
function authLogin(email, password) {
  const users = getRegisteredUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) return { ok: false, error: "Email o password non corretti." };
  const { password: _pw, ...safe } = user;
  setSession(safe);
  return { ok: true, user: safe };
}

function authRegister(name, email, password) {
  const users = getRegisteredUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, error: "Esiste già un account con questa email." };
  }
  const newUser = { id: Date.now(), name, email, password, role: "user" };
  users.push(newUser);
  saveRegisteredUsers(users);
  const { password: _pw, ...safe } = newUser;
  setSession(safe);
  return { ok: true, user: safe };
}

function authLogout() {
  console.log("Eseguo il logout...");

  // 1. Pulizia dei dati di autenticazione
  localStorage.removeItem("doisneau_user"); // Rimuove i dati dell'utente (se li hai)
  localStorage.setItem("doisneau_role", "guest"); // Riporta il ruolo a guest

  // 2. Feedback visivo (opzionale se usi i toast)
  if (typeof toast === "function") toast("Logout effettuato", "success");

  // 3. Reindirizzamento alla Home (fondamentale per resettare la navbar)
  // Usiamo un piccolo ritardo se vogliamo far vedere il toast, altrimenti immediato
  setTimeout(() => {
    window.location.href = "landingPage.html";
  }, 300);
}
// Aggiungi o sostituisci questa funzione in app.js
function handleLogout() {
  // 1. Cancella la sessione (dati utente)
  clearSession();

  // 2. Resetta il ruolo a guest nel localStorage e nella variabile globale
  // Usiamo setRole se presente, oppure resettiamo manualmente
  localStorage.setItem("doisneau_role", "guest");
  currentRole = "guest";

  // 3. Reindirizza alla home o ricarica
  window.location.href = "biglietti.html";
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

// ── THEME ──
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
