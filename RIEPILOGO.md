# Riepilogo lavoro frontend · AtelierDoisneau.it

Documento di consegna. Elenca cosa è stato fatto e i test manuali da eseguire.
Nessuna spiegazione di codice: per quella vedi `README.md` (sezione "logica di ogni pagina") e i commenti in testa ai file JS.

---

## 1. Struttura finale

```
frontend/
├── assets/
│   ├── css/style.css                    # design system unico (dark mode, palette viola/oro)
│   ├── fonts/                           # Playfair, Cormorant, DM Mono, Cinzel (tutti .woff2 locali)
│   │   └── fonts.css
│   ├── img/
│   │   ├── doisneau/                    # immagini mostra (hero, mosaico, landing)
│   │   ├── people/                      # avatar testimonianze landing
│   │   └── logo.png                     # logo Silk & Stack
│   ├── js/
│   │   ├── api.js                       # wrapper fetch REST (cookie HttpOnly)
│   │   ├── app.js                       # initApp, ruoli, toast, modal, helper
│   │   ├── navbar.js                    # renderNavbar(activeId, user)
│   │   └── footer.js                    # renderFooter()
│   └── download-resources.ps1           # script PowerShell per ri-scaricare fonts/immagini
├── landing.html                         # landing standalone (NON raggiunta dalla nav)
├── index.html                           # home del sito
├── azienda.html                         # chi siamo Silk & Stack
├── 404.html                             # errore
├── login.html / register.html           # autenticazione
├── shop-index.html / shop-detail.html
├── mostra-index.html / mostra-detail.html
├── admin-dashboard.html
├── admin-photos.html / admin-create-photo.html / admin-edit-photo.html
├── admin-products.html / admin-create-product.html / admin-edit-product.html
├── admin-users.html
├── README.md                            # specifiche + logica pagine
├── todo.md                              # checklist (tutto spuntato)
└── script1.sql                          # backend DB (invariato)
```

**19 pagine HTML** + 1 CSS + 4 JS. Zero dipendenze da CDN esterne: ogni font e ogni immagine vivono sotto `/assets`.

---

## 2. Cosa è stato fatto

### Fase 0 — Infrastruttura
- Creata cartella `assets/` con sotto-cartelle `css/`, `fonts/`, `img/`, `js/`.
- Scaricati in locale tutti i font Google (Playfair Display, Cormorant Garamond, DM Mono, Cinzel) e le immagini usate (hero mostra, mosaico, avatar testimonianze, logo).
- Creato `assets/css/style.css` (485 righe) come unico design system per tutte le pagine: token CSS, reset, tipografia Playfair/Cormorant/DM Mono, bottoni, navbar, footer, forms, auth-shell, cards, detail, state-badge, tabelle dati, dashboard, toast, modal, hero, mosaico, reveal, utilities, responsive a 960px/640px.
- Creati 4 moduli JS condivisi (`api.js`, `app.js`, `navbar.js`, `footer.js`).
- Rimossi i file vecchi rotti lasciati dall'iterazione precedente (`login.html` vecchio, `navbar.js` top-level, `shared.css`, `landingPage.html`).

### Fase 1 — Pagine base
- `index.html` **riscritto** come home del sito (hero, preview galleria, quote, info pratiche) usando navbar/footer condivisi e il nuovo design system.
- `landing.html` **creato** come pagina standalone di ingresso (hero full-bleed, tre pillar, tre testimonianze, CTA). Non è collegato alla navigazione del sito.
- `azienda.html` **aggiornato** per integrare navbar/footer condivisi e caricare `style.css` invece dei font via CDN. La sua CSS branded interna (Cinzel, palette violetto) è conservata.
- `404.html` **riscritto** con grafica "aperture" SVG, navbar/footer condivisi.

### Fase 2 — Autenticazione
- `login.html`: form con validazione client-side, chiamata `API.auth.login()`, redirect a `?from=` se presente. Se già loggato → redirect automatico.
- `register.html`: form con validazione regex username (`[A-Za-z0-9]+`), regex email come da schema DB, password ≥ 8 caratteri, conferma password, `API.users.register()`.

### Fase 3 — Shop
- `shop-index.html`: griglia di `.card-frame` con `API.products.list()`, descrizione troncata 20 caratteri, pulsante "Prenota" (disabilitato se `available = 0`). Nessuna paginazione.
- `shop-detail.html`: form quantità vincolata `min=1 max=available`, chiama `API.products.sell(id, qty)` dopo conferma modale. Se guest, redirect a login.

### Fase 4 — Mostra
- `mostra-index.html`: griglia `.card-art` con `API.photos.list()`, thumb da `photo.path`, data e titolo.
- `mostra-detail.html`: tutti i metadati + `.state-badge`. Logica azioni **ruolo × stato**: 5 combinazioni distinte (available/booked/sold × guest/user/owner/staff) con i rispettivi pulsanti che chiamano `book`/`unbook`/`setSold`.

### Fase 5 — Admin
8 pagine, tutte con `requireStaff(user)` come guardia.
- `admin-dashboard.html`: hub con 5 card linkate.
- `admin-photos.html` / `admin-products.html`: tabelle con azioni inline (Modifica link, Elimina con confirmModal).
- `admin-create-photo.html`: form `multipart/form-data` con tutti i campi + file, POST a `/photos/upload`.
- `admin-edit-photo.html?id=X`: prepopola i metadati, mostra anteprima immagine (non modificabile), PUT `/photos/`.
- `admin-create-product.html` / `admin-edit-product.html?id=X`: form JSON.
- `admin-users.html`: tabella utenti con badge ruolo colorato, azioni condizionali:
    - "Promuovi" / "Destituisci": solo se admin e target non-admin
    - "Elimina": staff, ma collaboratore non può eliminare admin né altri collaboratori; nessuno può eliminare sé stesso.

### Fase 6 — Finale
- `todo.md` aggiornato (tutti i punti spuntati, note su cosa è stato fatto dove).
- `README.md` sezione `## pagine` riscritta + nuova sezione `## logica di ogni pagina` allineata al reale comportamento del frontend (ignorando i dettagli obsoleti come la paginazione).

---

## 3. Test manuali da eseguire

Per ogni test: carica la pagina, verifica, ripeti con ruoli diversi. Il backend deve essere attivo e raggiungibile all'URL servito dal portatile-server.

### 3.1 Rete locale offline
1. Scollega il portatile da internet.
2. Apri `landing.html` e `index.html`: verifica che font, immagini, CSS e JS si carichino tutti (nessun errore 404 in DevTools → Network). Se qualcosa manca, lanciare `assets/download-resources.ps1` su una macchina con connessione e ricopiare l'intera `assets/`.

### 3.2 Navigazione di base (guest)
1. Da `landing.html` → CTA "Entra nella mostra" porta a `index.html`.
2. Su `index.html` la navbar mostra: Home, Shop, Galleria, Azienda, "Accedi" (nessun "Admin").
3. Passa per ogni voce: tutte caricano senza errori.

### 3.3 Registrazione & login
1. `register.html`: prova con username con caratteri speciali → errore client-side.
2. Prova con email malformata → errore.
3. Prova con password < 8 caratteri → errore.
4. Registrazione valida → toast successo → redirect a `login.html`.
5. Login con credenziali errate → "Credenziali non valide".
6. Login valido → toast + redirect a home; navbar ora mostra username + "Esci".
7. Apri `login.html` da loggato → redirect immediato.
8. Click "Esci" → logout + redirect home.

### 3.4 Shop
1. `shop-index.html`: conta prodotti in alto = numero card. Descrizioni troncate a 20 caratteri con "…".
2. Click "Prenota" su prodotto disponibile → detail.
3. Detail con `available > 0`: form presente, `max` = available, prezzo e disponibilità corretti.
4. Detail con `available = 0` (se c'è): form assente, messaggio "esaurito".
5. Modifica qty nel form → submit → confirmModal → conferma → toast successo. Ricarica: disponibilità diminuita.
6. Come guest, prova a submittare: redirect a login con `?from=` corretto.

### 3.5 Mostra
1. `mostra-index.html`: tutte le foto appaiono; click apre detail.
2. Detail con stato `available` da guest → pulsante "Accedi per prenotare".
3. Detail da user loggato + available → "Prenota". Confermando, stato cambia a `booked`.
4. Ricarica stessa pagina come stesso utente → pulsante "Annulla la mia prenotazione".
5. Ricarica come altro user → messaggio "prenotata" senza pulsanti.
6. Login come admin/collaborator → su foto booked: "Conferma vendita" + "Annulla prenotazione".
7. "Conferma vendita" → stato `sold`. Ricarica: nessun pulsante, solo messaggio "venduta".

### 3.6 Admin
1. Login come admin (o collaboratore). Navbar mostra "Admin".
2. `admin-dashboard.html`: 5 card tutte cliccabili.
3. Accedi come user normale direttamente a `admin-dashboard.html` → redirect a `index.html`.
4. `admin-photos.html`: tutte le foto in tabella con thumb. "Elimina" apre modale → conferma → riga sparisce + toast.
5. "Modifica" → `admin-edit-photo.html?id=X` → form prepopolato → salva → toast + redirect a elenco.
6. `admin-create-photo.html`: compila tutti i campi + carica file → crea → redirect.
7. Idem per `admin-products.html` / create / edit.
8. `admin-users.html`:
    - Come **admin**: vedi pulsanti "Promuovi" su user semplici, "Destituisci" su collaboratori, "Elimina" su chiunque tranne te e gli admin.
    - Come **collaborator**: non vedi "Promuovi"/"Destituisci" mai, vedi "Elimina" solo su user semplici (no admin, no collaboratori).
    - Non vedi azioni sulla tua stessa riga; vedi badge "tu".
    - Prova "Promuovi" → conferma → target ora badge "collaborator".
    - Prova "Destituisci" → torna "user".
    - Prova "Elimina" → riga sparisce.

### 3.7 Responsive
1. Apri Chrome DevTools → device toolbar → imposta iPhone/Android.
2. Verifica: navbar collassa in hamburger ≤ 960px; card-grid diventa 2 col ≤ 960px e 1 col ≤ 640px; form row diventa colonna singola; tabelle admin scrollano orizzontalmente.

### 3.8 Errori (stress test)
1. Spegni il backend → apri `shop-index.html`: viene mostrato "Errore di caricamento".
2. Apri `mostra-detail.html?id=99999` → messaggio "Opera non trovata".
3. Apri `shop-detail.html?id=abc` (id invalido) → "Prodotto non trovato".
4. Apri `admin-edit-photo.html` senza `?id=` → "Foto non trovata".

---

## 4. Note e limitazioni note

- **Nessuna paginazione** né filtri: tutte le liste caricano in blocco. Con dataset reali modesti (mostra Doisneau ≈ 100 foto, shop poche decine di prodotti) è accettabile.
- **Nessun honeypot** implementato (conferma esplicita utente).
- **Edit foto** non supporta la sostituzione dell'immagine (endpoint PUT accetta solo metadati; per cambiare l'immagine si elimina e si ricarica).
- **azienda.html** conserva la propria CSS interna (palette violetto diverso dal resto del sito) perché è una pagina "brand proposal" con identità visiva autonoma. È integrata solo a livello di navbar/footer/link.
- **Ambiente target**: portatile-server in rete locale senza internet. Tutti gli asset sono locali. Se in futuro servisse una connessione, nessun link esterno da rompere: zero CDN references nel codice.
