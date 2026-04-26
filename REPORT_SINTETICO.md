# Report sintetico · AtelierDoisneau.it

Cheat-sheet del frontend di **AtelierDoisneau.it**. Pensato per chi già conosce il dominio: rinfresca la struttura in due minuti, senza bisogno di altro materiale.

## In una frase
Frontend statico (HTML + Bootstrap 5.3 dark + JS vanilla, niente CDN) per la mostra **Doisneau · Pordenone**: shop souvenir + galleria opere prenotabili + area admin. Backend REST `/api/*` con cookie HttpOnly.

## Bootstrap di ogni pagina
```
api.js → app.js → navbar.js → footer.js
(async () => {
  const user = await initApp();      // GET /users/user
  renderNavbar('<id>', user);
  renderFooter();
  // logica pagina
})();
```
`api.js` ritenta una volta su 401 chiamando `/auth/refresh`.

## Pagine (19)
| Pagina | Cosa fa |
|---|---|
| `landing.html` | Hero standalone d'ingresso, non in nav |
| `index.html` | Home: hero + about + 3 nuclei + quote + sede |
| `azienda.html` | Brand page Silk & Stack (CSS interna propria) |
| `login.html` | Auth, redirect a `?from=` o `index` |
| `register.html` | Validazione client (regex user/email, pwd ≥8) |
| `shop-index.html` | Lista `products` in `.card-frame` |
| `shop-detail.html` | Form qty `1..available`, `products.sell` |
| `mostra-index.html` | Lista `photos` in `.card-art` |
| `mostra-detail.html` | Azioni per `ruolo × stato` (vedi sotto) |
| `admin-dashboard.html` | Hub 5 card |
| `admin-photos.html` | Tabella + delete inline |
| `admin-create-photo.html` | Form multipart upload |
| `admin-edit-photo.html?id=` | Edit metadati (no file) |
| `admin-products.html` | Tabella + delete inline |
| `admin-create-product.html` | Form JSON |
| `admin-edit-product.html?id=` | Edit JSON, preserva booked/sold |
| `admin-users.html` | Promuovi / destituisci / elimina condizionali |
| `404.html` | Errore con SVG aperture |

Tutte le pagine `admin-*` partono con `requireStaff(user)`.

## Ruoli × azioni
| | guest | user | collaborator | admin |
|---|:---:|:---:|:---:|:---:|
| Voce "Admin" in nav | – | – | ✓ | ✓ |
| Acquistare prodotto shop | login | ✓ | ✓ | ✓ |
| Prenotare opera | login | ✓ | ✓ | ✓ |
| Annullare propria prenotazione | – | ✓ | ✓ | ✓ |
| Conferma vendita opera | – | – | ✓ | ✓ |
| CRUD photos / products | – | – | ✓ | ✓ |
| Eliminare user semplice | – | – | ✓ | ✓ |
| Eliminare collaborator/admin | – | – | – | ✓ (no admin) |
| Promuovi / destituisci | – | – | – | ✓ |
| Eliminare sé stesso | – | – | – | – |

## Mostra-detail: matrice azioni
- `available` + guest → "Accedi per prenotare"
- `available` + loggato → `photos.book`
- `booked` + owner → `photos.unbook`
- `booked` + staff → `photos.setSold` + `photos.unbook`
- `booked` + altri → messaggio "prenotata"
- `sold` → messaggio "venduta"

## API REST (`window.API` → endpoint backend)
Tutte sotto `/api`, con `credentials: 'include'`. Cookie HttpOnly gestiti dal server. `204` = no content, `401` non-`/auth/*` → retry trasparente via `/auth/refresh`.

| `API.*` (JS)                       | Verbo + path                          | Note |
|---|---|---|
| `auth.login(u,p)`                  | `POST /auth/login`                    | body `{username,password}` |
| `auth.refresh()`                   | `GET  /auth/refresh`                  | rinnova cookie |
| `auth.logout()`                    | `GET  /auth/logout`                   | invalida cookie |
| `users.register(p)`                | `POST /users/register`                | body `{username,email,password}` |
| `users.me()`                       | `GET  /users/user`                    | "chi sono io" |
| `users.list()`                     | `GET  /users`                         | staff |
| `users.get(id)`                    | `GET  /users/{id}`                    | staff |
| `users.update(u)`                  | `PUT  /users`                         | staff, body `User` |
| `users.delete(id)`                 | `DELETE /users/{id}`                  | staff, regole ruolo |
| `users.opCollaborator(id)`         | `PUT  /users/opCollaborator/{id}`     | solo admin |
| `users.deopCollaborator(id)`       | `PUT  /users/deopCollaborator/{id}`   | solo admin |
| `products.list()`                  | `GET  /products`                      | |
| `products.get(id)`                 | `GET  /products/{id}`                 | |
| `products.create(p)`               | `POST /products`                      | staff |
| `products.update(p)`               | `PUT  /products`                      | staff |
| `products.delete(id)`              | `DELETE /products/{id}`               | staff |
| `products.sell(id, qty)`           | `PUT  /products/sell/{id}/{qty}`      | -avail +sold |
| `products.addAvailable(id, qty)`   | `PUT  /products/addAvailable/{id}/{qty}` | +avail |
| `photos.list()`                    | `GET  /photos`                        | |
| `photos.filter(state)`             | `GET  /photos/filter/{state}`         | available/booked/sold |
| `photos.get(id)`                   | `GET  /photos/{id}`                   | |
| `photos.upload(formData)`          | `POST /photos/upload`                 | staff, multipart con `photo` file |
| `photos.update(p)`                 | `PUT  /photos`                        | staff, **solo metadati** |
| `photos.delete(id)`                | `DELETE /photos/{id}`                 | staff |
| `photos.book(imgId, userId)`       | `PUT  /photos/book/{imgId}/{userId}`  | qualunque user loggato |
| `photos.unbook(imgId)`             | `PUT  /photos/unbook/{imgId}`         | owner o staff |
| `photos.setSold(imgId)`            | `PUT  /photos/setsold/{imgId}`        | staff |

## Helper utili (`window.*`)
`getRole` · `isStaff` · `requireAuth` · `requireStaff` · `requireAdmin` · `toast(msg,type)` · `confirmModal(msg,opts)→Promise<bool>` · `truncate` · `fmtPrice` (€ it-IT) · `qs(name)` · `escapeHtml` · `photoUrl(path)` · `photoStateKey/Label/Int`

## Entità DB (campi chiave)
- **User**: `user_id`, `username` unique `[A-Za-z0-9]+`, `email` unique regex, `password_hash`+`salt`, `admin`, `collaborator`
- **Product**: `product_id`, `name`, `description`, `price`, `available`, `booked`, `sold`
- **Photo**: `photo_id`, `path`, `title`, `original_title`, `date`, `place`, `description`, `state` (`available|booked|sold`), `price`, `booked_by` FK
- **Session**: `session_id`, `token` (44 char sha256+b64), `created`, `expires` (+7gg), `user_id`

## Limitazioni note
no paginazione · no filtri lista · edit photo non cambia il file · `landing.html` non in nav · `azienda.html` con CSS propria · zero CDN (offline-ready) · no honeypot
