async function renderNavbar(activePage, user) {
  if (!document.querySelector('link[href*="font-awesome"]')) {
    const faLink = document.createElement('link');
    faLink.rel = 'stylesheet';
    faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    document.head.appendChild(faLink);
  }
  const style = document.createElement('style');
  style.textContent = `
    .navbar, .navbar a, .nb-links a, .nb-cta {
      font-family: 'Cormorant Garamond', serif !important;
      font-weight: 500 !important;
      font-size: 16px !important;
      text-transform: none !important;
      letter-spacing: 0.05em !important;
    }
    .nb-logo {
      font-family: 'Playfair Display', serif !important;
      font-weight: 700 !important;
      font-size: 14px !important;
      letter-spacing: 0.22em !important;
      text-transform: uppercase !important;
    }
    .nb-links a.active {
      font-weight: 700 !important;
      border-bottom: 1.5px solid currentColor;
    }
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.2rem 2.5rem;
      background: rgba(10,10,10,0.8);
      backdrop-filter: blur(10px);
      border-bottom: 0.5px solid rgba(200, 180, 130, 0.2);
    }
    .nav-brand-link {
      display: flex;
      align-items: center;
      gap: 12px;           
      text-decoration: none;
    }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 1.2rem;
    }
    .nb-links {
      display: flex;
      list-style: none;
      gap: 2rem;
    }
    .nb-links a {
      text-decoration: none;
      color: inherit;
      opacity: 0.7;
      transition: opacity 0.3s;
    }
    .nb-links a:hover { opacity: 1; }
    .nb-cta {
      padding: 0.5rem 1.4rem;
      border: 0.5px solid #c8b482;
      color: #c8b482;
      text-decoration: none;
      transition: all 0.3s;
    }
    .nb-cta:hover { background: #c8b482; color: #0e0e0e; }
    body.light-mode .nb-cta { border-color: #9a3636; color: #9a3636; }
    body.light-mode .nb-cta:hover { background: #9a3636; color: #fff; }
  `;
  document.head.appendChild(style);

  const role = getRole(user);
  const loggedIn = !!user;

  const pages = [
    { id: "home", label: "Home", href: "index.html" },
    { id: "shop", label: "Shop", href: "shop-index.html" },
    { id: "mostra", label: "Galleria", href: "mostra-index.html" },
    { id: "biglietti", label: "Biglietti", href: "biglietti.html" },
  ];

  const linksHtml = pages.map(p => `
    <li><a href="${p.href}" data-page="${p.id}" class="${activePage === p.id ? "active" : ""}">${p.label}</a></li>
  `).join("");

  const adminLink = role === "admin" ? `<li><a href="admin-dashboard.html" data-page="admin" class="${activePage === "admin" ? "active" : ""}">Admin</a></li>` : "";

  const ctaButton = loggedIn
    ? `<a class="nb-cta" href="#" onclick="API.logout(); return false;">Esci</a>`
    : `<a class="nb-cta" href="login.html">Accedi</a>`;

  const html = `
    <nav class="navbar">
      <div class="nav-brand">
        <a href="index.html" class="nav-brand-link">
          <span class="nb-logo" style="color:#c8b482">Doisneau</span>
        </a>
      </div>
      <ul class="nb-links">
        ${linksHtml}
        ${adminLink}
      </ul>
      <div class="nav-actions">
        ${loggedIn ? `<span style="font-size:12px;opacity:0.6">${user.username}</span>` : ""}
        ${ctaButton}
        <button id="theme-toggle" class="theme-toggle-btn" onclick="toggleTheme()" style="background:none;border:none;color:inherit;cursor:pointer;font-size:1.2rem">☀</button>
      </div>
    </nav>`;

  document.body.insertAdjacentHTML("afterbegin", html);
  if (typeof applyTheme === "function") applyTheme();
}
