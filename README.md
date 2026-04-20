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

### honeypot

- /signup

## pagine
- [ ] login
- [ ] signup (/register come link per arrivarci)
- [ ] azienda
    - guardare file azienda.html creato da claude
- [ ] landing page: home
    - guardare file landingPage.html creato da claude
- [ ] shop
    - [ ] index
        - paginazione 20 prodotti per pagina
        - dati da visualizzare per tutti i prodotti:
            - quanti sono disponibili
            - nome
            - descrizione troncata a 20 caratteri
            - prezzo in €
        - pulsante "prenota" che manda alla pagina di dettaglio
    - [ ] detail
        - quanti sono disponibili
        - nome
        - descrizione
        - prezzo
        - form di prenotazione dove va inserita la quantità (minimo 1 massimo il numero di prodotti disponibili)
- [ ] mostra
    - [ ] index
        - paginazione 10 foto per pagina
    - [ ] detail
        - photo
        - title
        - originalTitle
        - year
        - place
        - description
        - state
        - price
        - eventuali pulsanti di prenotazione
        in caso di admin pulsante di conferma di vendita e annullamento prenotazione
        se l'utente che ha prenotato implementare la possibilità di eliminare la prenotazione
- [ ] admin
    - [ ] dashboard
        - link a tutte le altre pagine admin
    - [ ] create photo (form)
    - [ ] delete photo button
    - [ ] edit photo (form)
    - [ ]? index photo con filtri
    - [ ] create product (form)
    - [ ] delete product (button)
    - [ ] edit product (form)
    - [ ]? index product con filtri
    - [ ] index users with collaborator handling (button)

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
    - year:short
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