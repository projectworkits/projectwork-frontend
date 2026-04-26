# Report dettagliato · AtelierDoisneau.it

Documento di studio del frontend del sito **AtelierDoisneau.it**. Spiega, in ordine di profondità crescente, **cosa fa** il sito, **come è costruito**, **come funziona** ogni pagina, **quali endpoint REST** consuma e **quale schema DB** sta dietro. Si legge da solo, senza bisogno di aprire la repository del progetto.

---

## 1. Contesto e obiettivo

Il sito è il portale ufficiale della mostra **"Robert Doisneau · Lo sguardo che racconta"**, allestita alla Galleria Harry Bertoia di Pordenone (22 nov 2025 — 26 apr 2026). Risponde a due esigenze del curatore:

1. **Visitatore comune** → comprare souvenir della mostra (cataloghi, stampe minori, gadget) tramite uno **shop**.
2. **Cliente facoltoso** → registrarsi per **prenotare una specifica opera fotografica originale**, ritirarla in mostra e (eventualmente) acquistarla.

Le opere hanno quattro stati logici: `Disponibile`, `Prenotato`, `Venduto`, `Non Disponibile`. Il backend ne implementa tre (`available`, `booked`, `sold`); il quarto è gestito a livello editoriale (foto non caricate).

Realizzato dall'azienda fittizia **Silk & Stack** (CEO Riccardo, BE Alex, marketing Luigi, design Furio) come Project Work.

---

## 2. Architettura generale

Frontend **statico**, servito così com'è da qualunque web server (in produzione: portatile-server in rete locale). Nessun framework, nessun bundler, nessun CDN: solo HTML5, **Bootstrap 5.3** (dark mode, nessuna classe custom oltre il design system locale), un foglio `style.css` con i token e quattro moduli JS vanilla.

Flusso runtime di **ogni** pagina:

```
browser
  └─ carica HTML
       └─ <script src="api.js">     ── wrapper fetch
       └─ <script src="app.js">     ── helper, ruoli, modal, toast
       └─ <script src="navbar.js">  ── render navbar
       └─ <script src="footer.js">  ── render footer
       └─ <script>
            (async () => {
              const user = await initApp();   // GET /api/users/user via cookie
              renderNavbar('<id>', user);     // navbar ruolo-aware
              renderFooter();
              // …logica specifica della pagina…
            })();
          </script>
```

Il backend espone le API sotto `/api/*`. L'autenticazione è basata su **cookie HttpOnly** (`access_token` + `refresh_token`), gestiti dal server: il frontend non vede mai il token. Ogni `fetch` parte con `credentials: 'include'`; in caso di `401` su una rotta non-`/auth/`, `api.js` tenta automaticamente un `GET /auth/refresh` e ripete la richiesta una sola volta.

---

## 3. Stack, convenzioni, struttura cartelle

- **HTML**: 19 pagine in root, una per schermata. Naming `area-azione.html` (es. `admin-edit-photo.html`).
- **CSS**: `assets/css/style.css` unico design system (token, tipografia Playfair/Cormorant/DM Mono/Cinzel, palette violetto/oro su sfondo dark). Bootstrap 5.3 dark mode come baseline.
- **Font**: tutti `.woff2` locali sotto `assets/fonts/` (vedi `fonts.css`). Zero dipendenze CDN.
- **Immagini**: `assets/img/doisneau/` (mostra), `people/` (avatar landing), `logo.png`.
- **JS**: 4 moduli condivisi sotto `assets/js/`.
- **404**: pagina dedicata.

---

## 4. I quattro moduli JS

### 4.1 `api.js` — wrapper REST
Definisce l'oggetto globale `API` con tre namespace: `auth`, `users`, `products`, `photos`. La funzione interna `_request(path, opts)` aggiunge `Content-Type: application/json` se il body non è `FormData`, gestisce il **retry su 401** via `/auth/refresh`, lancia un `Error` con `.status` quando la risposta non è ok, ritorna `null` su `204`, JSON parsato su `application/json`, testo altrimenti.

### 4.2 `app.js` — bootstrap, ruoli, UI primitives
- `initApp()` → chiama `API.users.me()` e ritorna l'oggetto utente o `null` (catturando l'errore).
- `getRole(user)` → `'admin' | 'collaborator' | 'user' | 'guest'` in base ai flag `admin` e `collaborator`.
- `isStaff(user)` → true se admin o collaboratore.
- `requireAuth(user)` → se guest, redirect a `login.html?from=<path>` (per tornare dopo il login).
- `requireStaff(user)` / `requireAdmin(user)` → guardia per le pagine admin: redirect a `index.html` se non abilitato.
- `toast(msg, type)` → notifica volatile in alto a destra (auto-rimossa dopo 3.6s).
- `confirmModal(msg, opts)` → Promise<boolean>, modal a backdrop con bottone primario/danger.
- Helper: `truncate`, `fmtPrice` (locale `it-IT` con €), `qs(name)` (legge query param), `escapeHtml`, `photoUrl` (normalizza i path delle foto sul volume `/photos/`).
- Mapping stato foto: il backend accetta sia int (`0/1/2`) sia stringhe (`available/booked/sold`); `photoStateKey/Label/Int` traducono nei due sensi.
- `initReveal()` → IntersectionObserver che aggiunge la classe `.is-in` agli elementi `.reveal` quando entrano in viewport (animazioni sezione).

### 4.3 `navbar.js` — `renderNavbar(activeId, user)`
Costruisce dinamicamente il markup della navbar e lo inietta in cima al `<body>`. Le voci sono `Home / Shop / Galleria / Azienda`; la voce **Admin** appare solo se `isStaff(user)`. A destra: username + "Esci" se loggato, altrimenti "Accedi". Gestisce l'hamburger ≤960px e l'handler di logout (chiama `API.auth.logout()` poi redirect a `index`).

### 4.4 `footer.js` — `renderFooter()`
Footer minimale con brand "Silk & Stack", quattro link interni e copyright dinamico.

---

## 5. Modello dei ruoli

| Ruolo          | Vede Admin in nav | Shop · acquisto | Mostra · prenotare | Mostra · confermare vendita | Gestione utenti |
|----------------|:---:|:---:|:---:|:---:|:---|
| `guest`        | no  | no (redirect login al submit) | no | no | no |
| `user`         | no  | sì  | sì | no | no |
| `collaborator` | sì  | sì  | sì | sì | elimina solo `user` semplici |
| `admin`        | sì  | sì  | sì | sì | promuove/destituisce/elimina chiunque tranne sé stesso |

Regole non ovvie: un collaboratore **non** può eliminare admin né altri collaboratori; nessuno può eliminarsi da solo; solo l'admin promuove/destituisce.

---

## 6. Le quattro entità di dominio

- **User** — `user_id`, `username` (unique, `[A-Za-z0-9]+`), `email` (unique, regex standard), `password_hash` + `password_salt`, `verified` (timestamp opzionale), `admin` (bool), `collaborator` (bool).
- **Product** — `product_id`, `name`, `description`, `price`, `available` (giacenza), `booked`, `sold`. Souvenir/gadget, non opere d'arte.
- **Photo** — `photo_id`, `path` (file su volume condiviso `/photos/`), `title`, `original_title`, `date`, `place`, `description`, `state` (`available|booked|sold`), `price`, `booked_by` (FK→users, nullable).
- **Session** — `session_id`, `token` (sha256+base64, 44 char), `created`, `expires` (default +7 giorni), `user_id`. Gestita interamente dal backend.

---

## 7. Flusso pagina-per-pagina

### 7.1 Ingresso e contenuti pubblici
- **`landing.html`** — pagina standalone d'ingresso (NON raggiunta dalla navbar), hero full-bleed con tre pillar narrativi, testimonianze con avatar e CTA che portano a `index.html` / `login.html` / `register.html`. Ha un footer minimale inline proprio.
- **`index.html`** — home del sito. Hero con autoritratto Doisneau, barra date/sede, sezione "About" con mosaico, tre nuclei narrativi (link a `mostra-index`), citazione, info pratiche con coordinate. Nessuna chiamata API oltre a `initApp()` per popolare la navbar.
- **`azienda.html`** — chi siamo Silk & Stack. Conserva una propria CSS branded (Cinzel, palette violetto ottico) perché è una "brand proposal" con identità visiva autonoma; integrata col resto solo via navbar/footer condivisi.
- **`404.html`** — errore generico con grafica "aperture" SVG, due CTA verso home/galleria.

### 7.2 Autenticazione
- **`login.html`** — form `username`+`password`, validazione client-side col pattern `[A-Za-z0-9]+`. Chiama `API.auth.login()`. Su successo redirect a `?from=<path>` (settato da `requireAuth`) oppure a `index.html`. Se l'utente è già loggato all'apertura → redirect immediato.
- **`register.html`** — form `username`+`email`+`password`+`conferma`. Validazioni: regex username, regex email `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`, password ≥ 8 caratteri, le due password devono combaciare. Su `Created(201)` redirect a `login.html`.

### 7.3 Shop (souvenir)
- **`shop-index.html`** — `API.products.list()`, render in griglia di `.card-frame`. Ogni card mostra `name`, `truncate(description, 20)`, `fmtPrice(price)`, giacenza `available`. Pulsante "Prenota" linka a `shop-detail.html?id=X`; se `available === 0` il pulsante è visivamente disabilitato e marcato "Esaurito".
- **`shop-detail.html`** — `API.products.get(id)`, layout `.detail`. Form quantità con `min=1, max=available`. Se `available === 0` il form è nascosto e si mostra messaggio di esaurimento. Al submit: `confirmModal` → `API.products.sell(id, qty)` → toast → reload. Se guest, il submit invoca `requireAuth` che dirotta al login con `?from`.

### 7.4 Mostra (opere d'arte)
- **`mostra-index.html`** — `API.photos.list()`, griglia di `.card-art` (immagine come `background-image` da `photo.path`, overlay testo). Click → `mostra-detail.html?id=X`.
- **`mostra-detail.html`** — `API.photos.get(id)`, layout dettaglio con `<img>`, `.state-badge`, meta (data, luogo), descrizione, prezzo. Le **azioni** dipendono dalla combinazione **ruolo × stato**:
    - `available` + guest → `<a>` "Accedi per prenotare" (redirect login con `?from`).
    - `available` + user/staff → "Prenota quest'opera" → `API.photos.book(id, user.userId)`.
    - `booked` + owner (chi l'ha prenotata) → "Annulla la mia prenotazione" → `API.photos.unbook(id)`.
    - `booked` + staff → "Conferma vendita" (`setSold`) **e** "Annulla prenotazione" (`unbook`).
    - `booked` + altro user → solo messaggio "Opera attualmente prenotata".
    - `sold` → solo messaggio "Venduta, non più disponibile".

### 7.5 Area admin (8 pagine)
Tutte iniziano con `requireStaff(user)` subito dopo `initApp()`: chi non è staff viene rimandato a `index.html`.

- **`admin-dashboard.html`** — hub con 5 card linkate (gestione foto, nuova foto, gestione prodotti, nuovo prodotto, gestione utenti).
- **`admin-photos.html`** — `.data-table` (id, thumb, titolo, data, state, prezzo) + azioni inline: Modifica → `admin-edit-photo.html?id=X`; Elimina → `confirmModal` + `API.photos.delete(id)` → la riga sparisce.
- **`admin-create-photo.html`** — form `multipart/form-data` con `photo` (file), `title`, `originalTitle`, `year`, `place`, `description`, `state` (select), `price`. POST `API.photos.upload(formData)`.
- **`admin-edit-photo.html?id=X`** — `API.photos.get`, mostra anteprima (non modificabile: l'endpoint PUT non gestisce upload), prepopola i metadati, invia `API.photos.update(photo)` preservando `bookedBy`.
- **`admin-products.html`** — tabella (id, name, descrizione, available, sold, price) + Modifica / Elimina.
- **`admin-create-product.html`** / **`admin-edit-product.html?id=X`** — form JSON, POST/PUT su `/products`. L'edit preserva `booked` e `sold` correnti.
- **`admin-users.html`** — tabella utenti con badge ruolo; azioni condizionali:
    - "Promuovi" → `opCollaborator` (solo admin, target = user semplice);
    - "Destituisci" → `deopCollaborator` (solo admin, target = collaboratore);
    - "Elimina" → `users.delete` (staff, ma collaboratore non può colpire admin né altri collaboratori; nessuno se stesso);
    - L'utente corrente è marcato con badge "tu" e non ha pulsanti su di sé.

---

## 8. Endpoint REST consumati dal frontend

Tutte le rotte sono sotto `/api`. Le richieste viaggiano sempre con `credentials: 'include'`; il backend gestisce in autonomia i cookie HttpOnly `access_token` e `refresh_token`. Il frontend non vede mai il token in chiaro.

**Auth**
- `POST /auth/login` — body `{ username, password }` → `200` + cookies, oppure `401`.
- `GET  /auth/refresh` — `200` se il refresh cookie è valido, altrimenti `401`.
- `GET  /auth/logout` — `200`, il server invalida i cookie.

**Users**
- `POST /users/register` — body `{ username, email, password }` → `201` o `400`.
- `GET  /users/user` — chi sono io? `200` con oggetto `User` o `401`.
- `GET  /users` — lista utenti (staff). `200` o `401/403`.
- `GET  /users/{id}` — singolo utente (staff). `200` o `404`.
- `PUT  /users` — update (staff). Body `User` completo. `204` o `404`.
- `DELETE /users/{id}` — (staff). `204` / `404` / `401` (no self-delete e regole di ruolo applicate lato BE).
- `PUT  /users/opCollaborator/{id}` — promuove a collaboratore (solo admin). `204` o `404`.
- `PUT  /users/deopCollaborator/{id}` — degrada a user semplice (solo admin). `204` o `404`.

**Products** (souvenir dello shop)
- `GET  /products` — lista. `200`.
- `GET  /products/{id}` — singolo. `200` o `404`.
- `POST /products` — crea (staff). Body `{ name, description, price, available }`. `201` o `400`.
- `PUT  /products` — update (staff). Body `Product` completo. `204` o `404`.
- `DELETE /products/{id}` — (staff). `204` o `404`.
- `PUT  /products/sell/{id}/{qty}` — abbassa `available` di `qty`, alza `sold`. `204` o `404`.
- `PUT  /products/addAvailable/{id}/{qty}` — alza `available` di `qty`. `204` o `404`.

**Photos** (opere d'arte della mostra)
- `GET  /photos` — lista completa.
- `GET  /photos/filter/{state}` — filtra per `available` / `booked` / `sold`.
- `GET  /photos/{id}` — singola. `200` o `404`.
- `POST /photos/upload` — `multipart/form-data` con campo `photo` (file) + `title`, `originalTitle`, `year`, `place`, `description`, `state` (0/1/2 o stringa), `price`. `201` o `400`. (Staff)
- `PUT  /photos` — update **solo metadati**, non il file. Body `Photo` completo. `204` o `404`. (Staff)
- `DELETE /photos/{id}` — (staff). `204` o `404`.
- `PUT  /photos/book/{imgId}/{userId}` — prenota (qualunque user loggato). `204` o `404`.
- `PUT  /photos/unbook/{imgId}` — annulla prenotazione. `204` se è chi ha prenotato (o staff), `403/404` altrimenti.
- `PUT  /photos/setsold/{imgId}` — segna come venduta (staff). `204` o `404`.

Codici comuni: `200 OK`, `201 Created`, `204 No Content`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`. Su `401` (escluso `/auth/*`) il wrapper `api.js` fa **un** retry trasparente via `/auth/refresh`.

---

## 9. Schema database (riferimento)

Quattro tabelle. Il frontend non ci parla mai direttamente: tutti gli accessi passano dal backend REST.

**users**
- `user_id` int PK
- `username` varchar(50) **unique**, regex `[A-Za-z0-9]+`, niente spazi né caratteri speciali
- `password_salt` varchar (non unique)
- `password_hash` varchar (non unique)
- `email` varchar(100) **unique**, regex `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
- `verified` timestamp, default `NULL`
- `admin` tinyint(1) — flag amministratore
- `collaborator` tinyint(1) — flag staff non-admin

**products**
- `product_id` int PK
- `name` varchar(255)
- `description` text
- `price` decimal
- `available` int — giacenza acquistabile
- `booked` int — riservati
- `sold` int — già venduti

**photos**
- `photo_id` int PK
- `path` varchar(255) **unique** — file su volume condiviso, servito da `/photos/<uuid>`
- `title` varchar(100) **unique**
- `original_title` varchar(100) **unique**
- `date` varchar(30)
- `place` varchar(100)
- `description` text
- `state` enum(`available`, `booked`, `sold`)
- `price` decimal
- `booked_by` int FK → `users.user_id`, nullable

**sessions** (gestita interamente dal backend)
- `session_id` int PK
- `token` varchar(44) — sha256 in base64
- `created` timestamptz default `NOW()`
- `expires` timestamptz default `NOW() + interval '7 days'`
- `user_id` int FK → `users.user_id`

---

## 10. Caso d'uso end-to-end · prenotazione opera

1. Visitatore arriva su `landing.html` → CTA "Entra nella mostra" → `index.html`.
2. Naviga "Galleria" → `mostra-index.html` → click su un'opera `available` → `mostra-detail.html?id=42`.
3. È guest: vede "Accedi per prenotare" → click → `login.html?from=mostra-detail.html?id=42`.
4. Non ha account: link a `register.html` → compila → `Created(201)` → torna a `login.html`.
5. Login → cookie HttpOnly settati dal backend → redirect al `from` originale.
6. Su `mostra-detail.html?id=42` la stessa pagina ora mostra "Prenota quest'opera" → click → `confirmModal` → `API.photos.book(42, user.userId)` → toast successo → reload → stato ora `booked`, vede "Annulla la mia prenotazione".
7. Allo sportello in mostra: lo staff fa login, apre l'opera, vede "Conferma vendita" → click → `API.photos.setSold(42)` → opera passa a `sold` ed esce dal circuito.

---

## 11. Punti di attenzione e limitazioni note

- **Nessuna paginazione né filtri**: tutte le liste caricano in blocco. Accettabile sui volumi attesi (≈100 foto, poche decine di prodotti).
- **Edit foto non sostituisce il file**: per cambiare l'immagine occorre eliminare e ricaricare.
- **Navbar e footer non sono nell'HTML**: vengono iniettati da JS dopo `initApp()`. Una pagina che dimentica di caricare i 4 script nell'ordine giusto resta senza chrome.
- **`landing.html` è isolata**: non è linkata dalla navbar perché funge da "porta d'ingresso" alternativa (es. campagne).
- **`azienda.html`** ha CSS interna propria (palette diversa) per ragioni di brand.
- **Zero CDN**: il sito gira anche offline su rete locale. Tutti i font (`.woff2`) e le immagini sono in `assets/`. Esiste uno script PowerShell (`assets/download-resources.ps1`) per ri-scaricarli da internet in caso di asset mancanti.
- **Honeypot non implementato** e nessuna paginazione: scelte esplicite del team.
