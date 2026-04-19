function renderNavbar(activePage) {

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
      color: ;
    }
    .nb-links a.active {
      font-weight: 700 !important;
      border-bottom: 1.5px solid currentColor;
    }
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
    }
    .nav-brand-link {
      display: flex;
      align-items: center;
      gap: 12px;           
      text-decoration: none;
    }
    .nav-icon {
      height: 40px;  
      width: auto;
      display: block;
      transition: transform 0.3s ease;
    }
    .nav-brand-link:hover .nav-icon {
      transform: scale(1.05);
    }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 0.8rem;
    }

    .nb-cart-link {
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none !important;
      color: #c8b482 !important; 
      font-size: 1.2rem !important;
      transition: transform 0.2s ease, opacity 0.2s ease;
      padding: 0 10px;
    }

    .nb-cart-link:hover {
      opacity: 0.8;
      transform: scale(1.1);
    }

    .nb-cart-link i {
      color: inherit;
    }
    body.light-mode .nb-cart-link {
      color: #9a3636 !important;
    }

  `;
  document.head.appendChild(style);

  const userRole = localStorage.getItem("doisneau_role") || "guest";
  const user = typeof currentUser === "function" ? currentUser() : null;
  const session = getSession();
  const loggedIn = !!session;

  // 3. Definizione Link Standard
  const pages = [
    { id: "home", label: "Home", href: "index.html" },
    { id: "shop", label: "Shop", href: "shop-index.html" },
    { id: "mostra", label: "Galleria", href: "mostra-index.html" },
    { id: "biglietti", label: "Biglietti", href: "biglietti.html" },
    { id: "landing page", label: "Landing Page", href: "landingPage.html" },
  ];

  const linksHtml = pages.map(p => `
    <li><a href="${p.href}" data-page="${p.id}" class="${activePage === p.id ? "active" : ""}">${p.label}</a></li>
  `).join("");

  const adminLink = `<li><a href="admin-dashboard.html" data-page="admin" class="${activePage === "admin" ? "active" : ""}">Admin</a></li>`;

  const ctaButton = loggedIn
    ? `<a class="nb-cta" href="#" onclick="handleLogout(); return false;">Esci</a>`
    : `<a class="nb-cta" href="login.html">Accedi</a>`;

  // 4. Sezione Utente (Login/Logout)
  const userArea = (user || userRole !== "guest")
    ? `<div class="nb-user" style="display:flex; align-items:center; gap: 1rem;">
         <span class="nb-username" style="font-size: 13px; opacity: 0.7;">
           ${user ? user.name.split(" ")[0] : "Account"}
         </span>
         <button class="nb-cta" style="cursor:pointer;" onclick="authLogout()">Esci</button>
       </div>`
    : `...`;

  const html = `
    <nav class="navbar">
      <div class="nav-brand">
        <div class="nav-brand-link">
          <span class="nb-logo">Doisneau</span>
        </div>
      </div>
      <ul class="nb-links">
        ${linksHtml}
        <li id="admin-nav-item" style="display:none">${adminLink}</li>
      </ul>
      <div style="display:flex;align-items:center;gap:0.8rem;">
        
        ${ctaButton}
        <a href="carrello.html" class="nb-cart-link">
          <i class="fa-solid fa-cart-shopping"></i>
        </a>
        
        <button id="theme-toggle" class="theme-toggle-btn" onclick="toggleTheme()">☀</button>
      </div>
    </nav>`;

  document.body.insertAdjacentHTML("afterbegin", html);

  // 6. CONTROLLO ACCESSO ADMIN (Cruciale)
  const adminItem = document.getElementById("admin-nav-item");
  if (adminItem) {
    if (userRole === "admin") {
      adminItem.style.display = "list-item";
    } else {
      adminItem.style.display = "none";
    }
  }

  if (typeof applyTheme === "function") applyTheme();
}
