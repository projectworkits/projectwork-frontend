# Nome Sito: `AtelierDoisneau.it`

In occasione della mostra a Pordenone di Doisneau "Lo sguardo che racconta" dobbiamo sviluppare un sito per il curatore della mostra che permetta alla gente comune di acquistare piccoli souvenir della mostra (sei già andato) e permette a milionari di registrarsi per prenotare una specifica opera d'arte e poi andarla a ritirare alla mostra (e magari visitarla)

[Quindi le opere hanno 4 stati, Disponibile, Prenotato, Venduto, Non Disponibile]

Palette: Violetto & Oro

# Nome Azienda: `Silk & Stack`

Siamo un'azienda che si occupa di programmazione per aziende che hanno clienti facoltosi.

Struttura dell'azienda: 

- Riccardo (CEO) [Responabile]	
- Alex (Database/Tecnico reperibile) [Responsabile BackEnd]
- Luigi (Marketing & Social Manager) [Responsabile Rapporti Umani]
- Furio (Design & Archittetura Informazione) [Responsabile Front-end]

# struttura sito

## rest api

### necessarie

##### authentication

- `/api/auth/login` (post)\
    prende nel body i campi `username` e `password`\
    restituisce `Ok(200)` con l'access token e il refresh token come cookies, altrimenti `Unauthorized(401)`

- `/api/auth/refresh` (get)\
    restituisce `Ok(200)` se il refresh token esiste ed è valido, altrimenti `Unauthorized(401)`

- `/api/auth/logout` (get)\
    restituisce `Ok(200)` con le indicazioni al browser di cancellare l'access token e il refresh token se presenti

##### products

per oggetto `Product` si intende un oggetto con tutti i campi della tabella products

- `/api/products/` (get)\
    restituisce `Ok(200)` con un array di oggetti `Product` che è la lista di tutti gli utenti

- `/api/products/{id}` (get)\
    restituisce `Ok(200)` con un oggetto `Product` oppure `NotFound(404)`

- `/api/products/` (post)\
    richiede il login per funzionare e che il jwt non sia manomesso, dunque potrebbe tornare `Unauthorized(401)`\
    se chi esegue l'api non è l'admin o un collaboratore, ritorna `Forbidden(403)`\
    prende campi nel body `name`, `description`, `price`, `available`\
    restituisce `Created(201)` oppure `BadRequest(400)` se i dati non ci sono

- `/api/products/` (put)\
    richiede il login per funzionare e che il jwt non sia manomesso, dunque potrebbe tornare `Unauthorized(401)`\
    se chi esegue l'api non è l'admin o un collaboratore, ritorna `Forbidden(403)`\
    prende nel body un oggetto di tipo `Product` con tutti i suoi campi\
    restituisce `NoContent(204)` se andato a buon fine, oppure `NotFound(404)`

- `/api/products/{id}` (delete)\
    richiede il login per funzionare e che il jwt non sia manomesso, dunque potrebbe tornare `Unauthorized(401)`\
    se chi esegue l'api non è l'admin o un collaboratore, ritorna `Forbidden(403)`\
    restituisce `NoContent(204)` se ha successo, `NotFound(404)` se non trova il product

- `/api/products/sell/{productId}/{quantity}` (put)\
    richiede il login per funzionare e che il jwt non sia manomesso, dunque potrebbe tornare `Unauthorized(401)`\
    se chi esegue l'api non è l'admin o un collaboratore, ritorna `Forbidden(403)`\
    restituisce `NoContent(204)` se ha successo, `NotFound(404)` se non trova il product\
    abbassa il numero di available di un oggetto e alza il suo count di sold

- `/api/products/sell/{productId}/{quantity}` (put)\
    richiede il login per funzionare e che il jwt non sia manomesso, dunque potrebbe tornare `Unauthorized(401)`\
    se chi esegue l'api non è l'admin o un collaboratore, ritorna `Forbidden(403)`\
    restituisce `NoContent(204)` se ha successo, `NotFound(404)` se non trova il product\
    alza il numero di available di un oggetto

##### photos

per oggetto `Photo` si intende un oggetto con tutti i campi della tabella photos

- `/api/photos/` (get)\
    restituisce `Ok(200)` con un array di oggetti `Photo` che è la lista di tutte le foto

- `/api/photos/{id}` (get)\
    restituisce `Ok(200)` con un oggetto `Photo` oppure `NotFound(404)`

- `/api/photos/upload` (post)\
    richiede il login per funzionare e che il jwt non sia manomesso, dunque potrebbe tornare `Unauthorized(401)`\
    se chi esegue l'api non è l'admin o un collaboratore, ritorna `Forbidden(403)`\
    prende nel body un oggetto con campi `title`, `originalTitle`, `year`, `place`, `description`, `state`, `price` e un campo `photo` con il file\
    warning: il campo state accetta come parametri 0 o available, 1 o booked, 2 o sold (stringhe da testare)\
    restituisce `Created(201)` oppure `BadRequest(400)` se i dati non ci sono

- `/api/photos/` (put)\
    richiede il login per funzionare e che il jwt non sia manomesso, dunque potrebbe tornare `Unauthorized(401)`\
    se chi esegue l'api non è l'admin o un collaboratore, ritorna `Forbidden(403)`\
    prende nel body un oggetto di tipo `Photo` con tutti i suoi campi\
    restituisce `NoContent(204)` se andato a buon fine, oppure `NotFound(404)`

- `/api/photos/{id}` (delete)\
    richiede il login per funzionare e che il jwt non sia manomesso, dunque potrebbe tornare `Unauthorized(401)`\
    se chi esegue l'api non è l'admin o un collaboratore, ritorna `Forbidden(403)`\
    restituisce `NoContent(204)` se ha successo, `NotFound(404)` se non trova la foto

- `/api/photos/{state}` (get)\
    restituisce `Ok(200)` con un array di oggetti `Photo` è la lista di tutte le foto con uno state particolare\
    come available, booked, sold

- `/api/photos/book/{imageId}/{userId}` (put)\
    restituisce `noContent(204)` se lo userId esiste nel db e l'immagine viene prenotata, altrimenti `NotFound(404)` se
    l'immagine non esiste o lo user non esiste

- `/api/photos/unbook/{imageId}` (put)\
    restituisce `noContent(204)` se lo userId che fa la richiesta è quello che ha l'immagine prenotata nel db e la prenotazione dell'immagine viene annullata, altrimenti `Forbidden(403)` se lo user non è quello giusto, altrimenti `Forbidden(404)` se l'immagine non esiste

- `/api/photos/setsold/{imageId}` (put)\
    richiede il login per funzionare e che il jwt non sia manomesso, dunque potrebbe tornare `Unauthorized(401)`\
    se chi esegue l'api non è l'admin o un collaboratore, ritorna `Forbidden(403)`\
    se l'immagine non esiste, ritorna `NotFound(404)`

##### users

per oggetto `User` si intende un oggetto con tutti i campi della tabella users

- `/api/users/register` (post)\
    prende campi nel body `username`, `password`, `email`\
    restituisce `Created(201)` oppure `BadRequest(400)` se i dati non ci sono

- `/api/users/user` (get)\
    verifica che chi invia la richiesta abbia fatto il login\
    restituisce `Ok(200)` con oggetto `User` oppure `Unauthorized(401)` se non ha fatto il login

- `/api/users/` (get)\
    richiede il login per funzionare e che il jwt non sia manomesso, dunque potrebbe tornare `Unauthorized(401)`\
    se chi esegue l'api non è l'admin o un collaboratore, ritorna `Forbidden(403)`\
    restituisce `Ok(200)` con un array di oggetti `User` che è la lista di tutti gli utenti

- `/api/users/{id}` (get)\
    richiede il login per funzionare e che il jwt non sia manomesso, dunque potrebbe tornare `Unauthorized(401)`\
    se chi esegue l'api non è l'admin o un collaboratore, ritorna `Forbidden(403)`\
    restituisce `Ok(200)` con un oggetto `User` oppure `NotFound(404)`

- `/api/users/` (put)\
    richiede il login per funzionare e che il jwt non sia manomesso, dunque potrebbe tornare `Unauthorized(401)`\
    se chi esegue l'api non è l'admin o un collaboratore, ritorna `Forbidden(403)`\
    prende nel body un oggetto di tipo `User` con tutti i suoi campi\
    restituisce `NoContent(204)` se andato a buon fine, oppure `NotFound(404)`

- `/api/users/{id}` (delete)\
    richiede il login per funzionare e che il jwt non sia manomesso, dunque potrebbe tornare `Unauthorized(401)`\
    se chi esegue l'api non è l'admin o un collaboratore, ritorna `Forbidden(403)`\
    restituisce `NoContent(204)` se ha successo, `NotFound(404)` se non trova lo user, `Unauthorized(401)` se si prova a cancellare l'admin

- `/api/users/opCollaborator/{id}` (put)\
    richiede il login per funzionare e che il jwt non sia manomesso, dunque potrebbe tornare `Unauthorized(401)`\
    se chi esegue l'api non è l'admin, ritorna `Forbidden(403)`\
    restituisce `NoContent(204)` se andato a buon fine, oppure `NotFound(404)`
    rende uno user collaboratore

- `/api/users/deopCollaborator/{id}` (put)\
    richiede il login per funzionare e che il jwt non sia manomesso, dunque potrebbe tornare `Unauthorized(401)`\
    se chi esegue l'api non è l'admin, ritorna `Forbidden(403)`\
    restituisce `NoContent(204)` se andato a buon fine, oppure `NotFound(404)`
    rende un collaboratore uno user normale

Non implementato in questa iterazione (tempi stretti). Il readme cita `/signup`, ma il link pubblico alla registrazione punta a `register.html`.

## pagine

Elenco di tutte le pagine presenti in `/frontend` e loro ruolo (no paginazione, no honeypot — vedi `todo.md`):

| File | Area | Navbar | Accesso |
|---|---|---|---|
| `landing.html` | landing standalone | no | tutti |
| `index.html` | home | sì (`home`) | tutti |
| `azienda.html` | chi siamo (Silk & Stack) | sì (`azienda`) | tutti |
| `login.html` | autenticazione | sì | solo guest (redirect se loggato) |
| `register.html` | autenticazione | sì | solo guest (redirect se loggato) |
| `shop-index.html` | shop | sì (`shop`) | tutti |
| `shop-detail.html` | shop | sì | tutti (prenotazione richiede login) |
| `mostra-index.html` | galleria | sì (`mostra`) | tutti |
| `mostra-detail.html` | galleria | sì | tutti (azioni in base a ruolo/stato) |
| `admin-dashboard.html` | admin hub | sì (`admin`) | staff |
| `admin-photos.html` | gestione foto | sì | staff |
| `admin-create-photo.html` | form upload foto | sì | staff |
| `admin-edit-photo.html` | form edit foto (`?id=`) | sì | staff |
| `admin-products.html` | gestione prodotti | sì | staff |
| `admin-create-product.html` | form nuovo prodotto | sì | staff |
| `admin-edit-product.html` | form edit prodotto (`?id=`) | sì | staff |
| `admin-users.html` | gestione utenti | sì | staff (azioni filtrate per ruolo) |
| `404.html` | errore 404 | sì | tutti |

> "staff" = `user.admin === true` o `user.collaborator === true`. La voce "Admin" nella navbar è visibile solo agli staff.

## logica di ogni pagina

Tutte le pagine caricano nell'ordine `assets/js/api.js` → `app.js` → `navbar.js` → `footer.js` e avviano un IIFE `async` che chiama `initApp()` (che risolve `API.users.me()` via cookie HttpOnly), poi `renderNavbar(activeId, user)` e `renderFooter()`.

### landing / home / azienda / 404
- `landing.html` — pagina standalone di ingresso (niente nav integrata con il resto), hero full-bleed + CTA che portano a `index.html` / `login.html` / `register.html`. Renderizza un footer minimale inline.
- `index.html` — home del sito: hero, preview galleria, quote Doisneau, info pratiche. Nessuna logica server, solo `initApp()` per popolare la navbar ruolo-aware.
- `azienda.html` — pagina "Silk & Stack". Conserva la propria CSS branded (Cinzel/DM Sans, palette violetto/oro ottico), ma è integrata con navbar/footer condivisi.
- `404.html` — pagina errore generica con grafica "aperture" SVG e pulsanti per tornare alla home / galleria.

### autenticazione
- `login.html` — form username+password, validazione pattern `[A-Za-z0-9]+`, chiama `API.auth.login()`. Alla riuscita redirect a `?from=<path>` (impostato da `requireAuth`) o `index.html`. Se già loggato, redirect immediato.
- `register.html` — form username+email+password+conferma. Validazione regex username, regex email `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`, lunghezza password ≥ 8, password uguali. Chiama `API.users.register()` → su `Created(201)` redirect a `login.html`.

### shop
- `shop-index.html` — `API.products.list()` in griglia `.card-frame`. Ogni card mostra nome, `truncate(description, 20)`, `€ price`, `available`. Pulsante "Prenota" porta a `shop-detail.html?id=X`. Se `available === 0`, pulsante disabilitato visivamente con etichetta "Esaurito".
- `shop-detail.html` — `API.products.get(id)`, layout `.detail`. Form quantità con `min=1`, `max=available`; se `available === 0` il form è nascosto e mostra messaggio di esaurimento. All'invio: `confirmModal` + `API.products.sell(id, qty)`. Se guest al submit, redirect tramite `requireAuth`.

### mostra
- `mostra-index.html` — `API.photos.list()` in griglia `.card-art` (card immagine con overlay). Usa `photo.path` come `background-image`. Link a `mostra-detail.html?id=X`.
- `mostra-detail.html` — `API.photos.get(id)`, layout `.detail` con `<img src="photo.path">`, `.state-badge`, meta (data, luogo), descrizione, prezzo. Azioni in base a combinazione **ruolo × stato**:
    - `available`: guest → "Accedi per prenotare"; user/staff → `API.photos.book(id, user.user_id)`
    - `booked` + `isOwner` (chi ha prenotato): "Annulla la mia prenotazione" → `API.photos.unbook(id)`
    - `booked` + `isStaff`: "Conferma vendita" (`setSold`) + "Annulla prenotazione" (`unbook`)
    - `sold`: messaggio "Venduta, non più disponibile"

### admin
Tutte le pagine admin eseguono `requireStaff(user)` subito dopo `initApp()` (redirect a `index.html` se non-staff).

- `admin-dashboard.html` — griglia `.dash-grid` con card linkate ai 5 entry-point: gestione foto, nuova foto, gestione prodotti, nuovo prodotto, gestione utenti.
- `admin-photos.html` — tabella `.data-table` con id/thumb/titolo/data/state/prezzo + azioni inline (Modifica → `admin-edit-photo.html?id=X`, Elimina → `confirmModal` + `API.photos.delete(id)`).
- `admin-create-photo.html` — form `multipart/form-data` con campi `photo` (file), `title`, `originalTitle`, `year`, `place`, `description`, `state` (select: available/booked/sold), `price`. POST `API.photos.upload(formData)`.
- `admin-edit-photo.html?id=X` — carica la foto con `API.photos.get`, mostra anteprima (non modificabile, l'endpoint PUT non gestisce upload), prepopola i metadati, invia `API.photos.update(photo)` preservando `booked_by` corrente.
- `admin-products.html` — tabella con id/nome/descrizione/disp./venduti/prezzo + Modifica (→ edit) ed Elimina (→ `API.products.delete`).
- `admin-create-product.html` — form JSON con `name`, `description`, `price`, `available`. POST `API.products.create`.
- `admin-edit-product.html?id=X` — carica con `API.products.get`, prepopola, PUT con payload completo (preserva `booked` e `sold`).
- `admin-users.html` — tabella `.data-table` con id/username/email/ruolo + azioni condizionali:
    - "Promuovi" (solo se `myRole === 'admin'` e target è `user` semplice) → `API.users.opCollaborator(id)`
    - "Destituisci" (solo se `myRole === 'admin'` e target è `collaborator`) → `API.users.deopCollaborator(id)`
    - "Elimina" (staff, ma collaborator non può eliminare admin né altri collaborator; nessuno può eliminare sé stesso) → `API.users.delete(id)`
    - L'utente corrente è marcato con badge "tu".

# database

- [ ] products
    - product_id:int,pk
    - available:int
    - booked:int
    - sold:int
    - name:string(255)
    - description:text
    - price:decimal

- [ ] users
    - user_id:int,pk
    - username:string(50),unique (A-9, no space or special character)
    - password_salt:string(?-50) non deve essere unique
    - password_hash:string(?-50) non deve essere unique
    - email:string(100),unique (^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$)
    - verified:timestamp,defaultNull
    - admin:tinyInt(1)
    - collaborator:tinyInt(1)

- [ ] photos
    - photo_id:int,pk
    - path:string(255),unique
    - title:string(100),unique
    - original_title:string(100),unique
    - date:string(30)
    - place:string(100)
    - description:text
    - state:enum(["booked", "sold", "available"])
    - price:decimal
    - booked_by:int,fk(users),nullable

- [ ] sessions
    - session_id:int,pk
    - token:varchar(44) perché sha256 + base64 = 44 byte
    - created:timestamptz DEFAULT NOW()
    - expires:timestamptz DEFAULT NOW() + interval '7 days'
    - user_id:int,fk(users)