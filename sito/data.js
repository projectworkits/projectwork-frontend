// ── DATA STORE ──
// Struttura pronta per essere sostituita con API calls
// Sostituisci le funzioni in api.js per collegare il backend

const DB = {

  // ── PHOTOS ──
  photos: [
    {
      id: 1,
      title: "Il Bacio",
      originalTitle: "Le Baiser de l'Hôtel de Ville",
      year: 1950,
      place: "Parigi, Francia",
      description: "Una delle fotografie più iconiche del Novecento. Scattata in Place de l'Hôtel de Ville durante il fiorire della Parigi del dopoguerra, ritrae una coppia che si bacia in mezzo alla folla indifferente. Doisneau la realizzò su commissione per Life Magazine, ma divenne il simbolo universale dell'amore parigino.",
      state: "disponibile", // disponibile | prenotata | venduta
      price: 4800,
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Robert_Doisneau_Le_Baiser_de_l%27H%C3%B4tel_de_Ville.jpg/400px-Robert_Doisneau_Le_Baiser_de_l%27H%C3%B4tel_de_Ville.jpg",
      bookedBy: null,
    },
    {
      id: 2,
      title: "Picasso e il pane",
      originalTitle: "Picasso et les pains",
      year: 1952,
      place: "Vallauris, Francia",
      description: "Ritratto geniale di Pablo Picasso a tavola a Vallauris. Le dita allungate che reggono due panini sembrano prolungarsi come artigli. Doisneau aveva un talento raro: far sentire il soggetto a proprio agio fino a farlo diventare se stesso davanti all'obiettivo.",
      state: "prenotata",
      price: 6200,
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Doisneau_Picasso_1952.jpg/400px-Doisneau_Picasso_1952.jpg",
      bookedBy: "user",
    },
    {
      id: 3,
      title: "Bal du Moulin Rouge",
      originalTitle: "Bal du Moulin Rouge",
      year: 1949,
      place: "Parigi, Francia",
      description: "La Parigi notturna nella sua veste più festosa. Il Moulin Rouge sullo sfondo, le luci al neon, le coppie che danzano. Doisneau cattura il ritmo della città come un musicista jazz — mai una nota fuori posto, sempre sorprendente.",
      state: "disponibile",
      price: 3900,
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Doisneau_-_Bal_du_Moulin_Rouge%2C_Paris%2C_1949.jpg/400px-Doisneau_-_Bal_du_Moulin_Rouge%2C_Paris%2C_1949.jpg",
      bookedBy: null,
    },
    {
      id: 4,
      title: "Les Frères",
      originalTitle: "Les Frères",
      year: 1934,
      place: "Parigi, Francia",
      description: "Due fratelli nei sobborghi di Parigi, anni della grande crisi. Lo sguardo diretto, la dignità immutabile. Una delle prime fotografie di strada di Doisneau, già perfettamente matura nel tono e nella composizione.",
      state: "venduta",
      price: 5100,
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Robert_Doisneau_Le_Baiser_de_l%27H%C3%B4tel_de_Ville.jpg/400px-Robert_Doisneau_Le_Baiser_de_l%27H%C3%B4tel_de_Ville.jpg",
      bookedBy: null,
    },
    {
      id: 5,
      title: "L'Écolier",
      originalTitle: "L'Écolier de la rue Daguerre",
      year: 1956,
      place: "Parigi, Francia",
      description: "Un bambino percorre rue Daguerre con uno zaino enorme sulle spalle, quasi più grande di lui. La fotografia è allo stesso tempo comica e commovente — la miniatura dell'adulto che deve ancora diventare.",
      state: "disponibile",
      price: 2700,
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Doisneau_-_Bal_du_Moulin_Rouge%2C_Paris%2C_1949.jpg/400px-Doisneau_-_Bal_du_Moulin_Rouge%2C_Paris%2C_1949.jpg",
      bookedBy: null,
    },
    {
      id: 6,
      title: "Les Pains de Picasso",
      originalTitle: "Les Pains de Picasso",
      year: 1952,
      place: "Vallauris, Francia",
      description: "Variante dello scatto celebre, con angolazione diversa. Picasso in questa versione guarda dritto in camera — uno sguardo sfidante, curioso, irriverente. La complicità tra fotografo e soggetto è palpabile.",
      state: "disponibile",
      price: 5800,
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Doisneau_Picasso_1952.jpg/400px-Doisneau_Picasso_1952.jpg",
      bookedBy: null,
    },
    {
      id: 7,
      title: "La Vitrine",
      originalTitle: "La Vitrine de la galerie Romi",
      year: 1948,
      place: "Parigi, Francia",
      description: "Passanti che si fermano davanti alla vetrina di una galleria d'arte. Il riflesso del vetro sovrappone il mondo reale alle opere esposte — una delle composizioni più sofisticate di Doisneau, che gioca con i piani e le trasparenze.",
      state: "disponibile",
      price: 4200,
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Robert_Doisneau_Le_Baiser_de_l%27H%C3%B4tel_de_Ville.jpg/400px-Robert_Doisneau_Le_Baiser_de_l%27H%C3%B4tel_de_Ville.jpg",
      bookedBy: null,
    },
    {
      id: 8,
      title: "Le Reverbère",
      originalTitle: "Le Reverbère et la danseuse",
      year: 1953,
      place: "Parigi, Francia",
      description: "Una ballerina abbraccia un lampione sotto la pioggia. La città come scenografia teatrale, le luci sul selciato bagnato. Doisneau aveva questa capacità di trovare la poesia nell'ordinario, di vedere il palcoscenico dove altri vedono solo marciapiede.",
      state: "prenotata",
      price: 3600,
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Doisneau_-_Bal_du_Moulin_Rouge%2C_Paris%2C_1949.jpg/400px-Doisneau_-_Bal_du_Moulin_Rouge%2C_Paris%2C_1949.jpg",
      bookedBy: "user",
    },
    {
      id: 9,
      title: "Les Amoureux du Pont-Neuf",
      originalTitle: "Les Amoureux du Pont-Neuf",
      year: 1950,
      place: "Parigi, Francia",
      description: "Una coppia sul Pont-Neuf, la Senna sullo sfondo. Non il bacio celebre, ma qualcosa di più intimo: due persone che guardano l'acqua insieme in silenzio. La fotografia più silenziosa di Doisneau.",
      state: "disponibile",
      price: 4100,
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Doisneau_Picasso_1952.jpg/400px-Doisneau_Picasso_1952.jpg",
      bookedBy: null,
    },
    {
      id: 10,
      title: "La Loge de la Concierge",
      originalTitle: "La Loge de la Concierge",
      year: 1945,
      place: "Parigi, Francia",
      description: "La portinaia del palazzo nel suo regno minuscolo — libri, gatti, fiori finti, una sedia consumata. Doisneau era il cronista del popolo invisibile, di chi la storia non racconta ma che la città non potrebbe vivere senza.",
      state: "disponibile",
      price: 3300,
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Robert_Doisneau_Le_Baiser_de_l%27H%C3%B4tel_de_Ville.jpg/400px-Robert_Doisneau_Le_Baiser_de_l%27H%C3%B4tel_de_Ville.jpg",
      bookedBy: null,
    },
    {
      id: 11,
      title: "Le Marchand de journaux",
      originalTitle: "Le Marchand de journaux",
      year: 1946,
      place: "Parigi, Francia",
      description: "Un venditore di giornali all'angolo di una strada, avvolto nel vapore del mattino. Intorno a lui il mondo che si sveglia. Una delle fotografie più cinematografiche di Doisneau — potrebbe essere una scena di Marcel Carné.",
      state: "disponibile",
      price: 2900,
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Doisneau_-_Bal_du_Moulin_Rouge%2C_Paris%2C_1949.jpg/400px-Doisneau_-_Bal_du_Moulin_Rouge%2C_Paris%2C_1949.jpg",
      bookedBy: null,
    },
    {
      id: 12,
      title: "Les Enfants du canal",
      originalTitle: "Les Enfants du canal Saint-Martin",
      year: 1955,
      place: "Parigi, Francia",
      description: "Bambini che giocano lungo le sponde del Canal Saint-Martin in estate. I piedi nell'acqua, le risate. La Parigi che stava per scomparire, ancora viva e chiassosa in questo angolo dimenticato.",
      state: "venduta",
      price: 3500,
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Doisneau_Picasso_1952.jpg/400px-Doisneau_Picasso_1952.jpg",
      bookedBy: null,
    },
  ],

  // ── PRODUCTS ──
  products: [
    {
      id: 1,
      name: "Catalogo ufficiale della mostra",
      description: "Il catalogo completo della retrospettiva. 240 pagine, carta patinata, oltre 180 riproduzioni fotografiche in alta qualità. Testi critici di Brigitte Ollier e Jean-François Chevrier. Edizione numerata e firmata disponibile su richiesta.",
      price: 38,
      available: 45,
      img: null,
    },
    {
      id: 2,
      name: "Stampa fine art — Le Baiser",
      description: "Riproduzione autorizzata su carta Hahnemühle 310g. Formato 40×50 cm, tiratura limitata a 200 esemplari. Ogni stampa è numerata e accompagnata da certificato di autenticità della Fondazione Doisneau.",
      price: 120,
      available: 12,
      img: null,
    },
    {
      id: 3,
      name: "Stampa fine art — Picasso",
      description: "Riproduzione autorizzata su carta Hahnemühle 310g. Formato 40×50 cm, tiratura limitata a 200 esemplari. Una delle immagini più amate della collezione, disponibile per la prima volta in formato da collezione.",
      price: 120,
      available: 8,
      img: null,
    },
    {
      id: 4,
      name: "Poster della mostra",
      description: "Il poster ufficiale della mostra in formato 50×70 cm. Stampa offset su carta da 170g, colori calibrati sugli originali d'archivio. Design esclusivo realizzato dallo studio Malaquais, Parigi.",
      price: 18,
      available: 200,
      img: null,
    },
    {
      id: 5,
      name: "Set cartoline — 12 pezzi",
      description: "Dodici cartoline con le fotografie più iconiche della collezione. Carta 350g con finitura opaca. Formato 10×15 cm, bordi bianchi in stile vintage. Ideale come souvenir o per la corrispondenza.",
      price: 12,
      available: 150,
      img: null,
    },
    {
      id: 6,
      name: "Tote bag «Sguardo che racconta»",
      description: "Borsa in cotone biologico 100% con stampa serigrafica a due colori. Dettaglio de «Le Baiser» sul fronte, logo della mostra sul retro. Dimensioni 38×42 cm, manici in tela rinforzata.",
      price: 22,
      available: 60,
      img: null,
    },
    {
      id: 7,
      name: "Audioguida digitale (download)",
      description: "L'audioguida ufficiale della mostra in formato MP3. Oltre 90 minuti di commento curatoriale in italiano, francese e inglese. Tracce separate per ogni sala e per ogni fotografia principale. Download immediato dopo l'acquisto.",
      price: 5,
      available: 999,
      img: null,
    },
    {
      id: 8,
      name: "Notebook «Paris, toujours»",
      description: "Taccuino rilegato a filo, copertina rigida con fotografia in bianco e nero. 192 pagine di carta avorio 90g, righe sottili. Segnalibro in satin dorato. Un oggetto da scrivania degno della poetica di Doisneau.",
      price: 16,
      available: 85,
      img: null,
    },
    {
      id: 9,
      name: "Magnete set — 6 pezzi",
      description: "Sei magneti in metallo cromato con le fotografie più amate della mostra. Dimensione 5×7 cm, stampa sublimazione ad alta risoluzione. Retro gommato antiscivolo. Una piccola mostra per il tuo frigorifero.",
      price: 14,
      available: 120,
      img: null,
    },
    {
      id: 10,
      name: "Segnalibri — set 4 pezzi",
      description: "Quattro segnalibri in cartoncino plastificato opaco. Formato 5×21 cm, con citazioni di Doisneau al verso. Stampa bifronte, quattro fotografie diverse. Confezionati in bustina trasparente con etichetta della mostra.",
      price: 8,
      available: 300,
      img: null,
    },
    {
      id: 11,
      name: "Tazza in porcellana",
      description: "Tazza da 350ml in porcellana bianca con fotografia in bianco e nero. Dishwasher safe. Stampa resistente alle lavastoviglie certificata. Confezionata in scatola regalo con carta velina nera.",
      price: 19,
      available: 40,
      img: null,
    },
    {
      id: 12,
      name: "Monografia — Doisneau l'Humaniste",
      description: "Volume enciclopedico di riferimento sull'opera di Robert Doisneau. 420 pagine, oltre 500 fotografie, apparato critico completo. Con prefazione di Sabine Weiss e cronologia illustrata. Edizione italiana di Contrasto.",
      price: 58,
      available: 25,
      img: null,
    },
    {
      id: 13,
      name: "Stampa fine art — Moulin Rouge",
      description: "La notte parigina nella sua versione da collezione. Formato 40×50 cm, carta baryta 320g, processo pigment ink. Ogni esemplare è numerato su tiratura di 150. Spedizione in tubo protettivo con angolari in cartone.",
      price: 95,
      available: 18,
      img: null,
    },
    {
      id: 14,
      name: "Spilla smaltata — Le Baiser",
      description: "Spilla in metallo zincato con smalto a freddo. Dimensione 3×4 cm, chiusura a farfalla. Il bacio di Doisneau in formato tascabile — da indossare ogni giorno come promemoria della bellezza che si nasconde ovunque.",
      price: 9,
      available: 200,
      img: null,
    },
    {
      id: 15,
      name: "Box regalo — Collezione completa",
      description: "Il regalo perfetto per i veri appassionati. Contiene: catalogo della mostra, stampa fine art a scelta, set cartoline, tote bag e segnalibri. Tutto confezionato in una scatola nera con nastro dorato e biglietto personalizzabile.",
      price: 175,
      available: 10,
      img: null,
    },
    {
      id: 16,
      name: "Visita guidata privata (2 persone)",
      description: "Un'ora e mezza in compagnia di uno dei curatori della mostra, fuori dall'orario di apertura. Accesso esclusivo ai materiali d'archivio non esposti al pubblico. Disponibile nei giorni di lunedì. Prenotazione almeno 7 giorni prima.",
      price: 180,
      available: 4,
      img: null,
    },
    {
      id: 17,
      name: "Penna stilografica «Doisneau»",
      description: "Penna stilografica edizione speciale con pennino F in acciaio inox. Corpo in resina nera opaca con clip cromata. Incisione laser del logo della mostra. Fornita con cartucce blu e nera e custodia in pelle.",
      price: 45,
      available: 30,
      img: null,
    },
    {
      id: 18,
      name: "Foulard in seta — 70×70 cm",
      description: "Foulard in seta pura 100% twill. Stampa digitale con montaggio di 9 fotografie iconiche. Orlo arrotolato a mano, etichetta tessuta. Un pezzo di moda con l'anima della fotografia umanista.",
      price: 85,
      available: 22,
      img: null,
    },
    {
      id: 19,
      name: "Album fotografico «La mia Parigi»",
      description: "Album da completare — 50 tasche per fotografie 10×15, con pagine interlineate per didascalie. Copertina in tela grigia con stampa a caldo dorata. Ispirati da Doisneau, raccontate la vostra città.",
      price: 28,
      available: 55,
      img: null,
    },
    {
      id: 20,
      name: "Workshop di fotografia di strada",
      description: "Una mattinata nel centro storico di Bologna con un fotografo professionista. 10 partecipanti massimo. Ispirato alla poetica di Doisneau: osservare, attendere, non interferire. Materiale didattico incluso. Apertura gratuita alla mostra al termine.",
      price: 65,
      available: 6,
      img: null,
    },
    {
      id: 21,
      name: "Calendario da parete 2027",
      description: "Calendario da parete 35×50 cm con 12 fotografie selezionate dall'archivio Doisneau. Stampa offset su carta 170g, spirale metallica argento. Include festività italiane, francesi e date legate alla vita del fotografo.",
      price: 15,
      available: 75,
      img: null,
    },
    {
      id: 22,
      name: "Portafoto doppio — legno e vetro",
      description: "Portafoto per due immagini 10×15, in legno di noce naturale e vetro temperato. Design ispirato alle cornici dei bistrot parigini anni '50. Supporto da appoggio e gancio per appendere. Finitura a olio naturale.",
      price: 34,
      available: 35,
      img: null,
    },
  ],

  // ── USERS ──
  users: [
    { id: 1, name: "Giulia Ferretti", email: "giulia@example.com", role: "collaboratore" },
    { id: 2, name: "Marco Santini",   email: "marco@example.com",   role: "utente" },
    { id: 3, name: "Anna Ricci",      email: "anna@example.com",    role: "utente" },
    { id: 4, name: "Luca Mori",       email: "luca@example.com",    role: "collaboratore" },
    { id: 5, name: "Sara Conti",      email: "sara@example.com",    role: "utente" },
    { id: 6, name: "Paolo Gentile",   email: "paolo@example.com",   role: "utente" },
  ],

  // ── BOOKINGS ──
  bookings: [
    { id: 1, type: "photo",   itemId: 2, userId: "user", qty: 1, date: "2026-04-01" },
    { id: 2, type: "photo",   itemId: 8, userId: "user", qty: 1, date: "2026-04-03" },
    { id: 3, type: "product", itemId: 3, userId: "user", qty: 2, date: "2026-04-05" },
  ],

};

// ── API LAYER ── (sostituisci queste funzioni con fetch() reali)
const API = {

  // Photos
  getPhotos: () => Promise.resolve([...DB.photos]),
  getPhoto:  (id) => Promise.resolve(DB.photos.find(p => p.id === id) || null),
  createPhoto: (data) => {
    const p = { ...data, id: Date.now(), state: "disponibile", bookedBy: null };
    DB.photos.push(p);
    return Promise.resolve(p);
  },
  updatePhoto: (id, data) => {
    const i = DB.photos.findIndex(p => p.id === id);
    if (i < 0) return Promise.reject("not found");
    DB.photos[i] = { ...DB.photos[i], ...data };
    return Promise.resolve(DB.photos[i]);
  },
  deletePhoto: (id) => {
    DB.photos = DB.photos.filter(p => p.id !== id);
    return Promise.resolve();
  },
  bookPhoto: (id) => {
    const p = DB.photos.find(x => x.id === id);
    if (!p || p.state !== "disponibile") return Promise.reject("non disponibile");
    p.state = "prenotata";
    p.bookedBy = "user";
    DB.bookings.push({ id: Date.now(), type: "photo", itemId: id, userId: "user", qty: 1, date: new Date().toISOString().slice(0,10) });
    return Promise.resolve(p);
  },
  cancelPhotoBooking: (id) => {
    const p = DB.photos.find(x => x.id === id);
    if (!p) return Promise.reject("not found");
    p.state = "disponibile";
    p.bookedBy = null;
    DB.bookings = DB.bookings.filter(b => !(b.type === "photo" && b.itemId === id));
    return Promise.resolve(p);
  },
  confirmSale: (id) => {
    const p = DB.photos.find(x => x.id === id);
    if (!p) return Promise.reject("not found");
    p.state = "venduta";
    return Promise.resolve(p);
  },

  // Products
  getProducts: () => Promise.resolve([...DB.products]),
  getProduct:  (id) => Promise.resolve(DB.products.find(p => p.id === id) || null),
  createProduct: (data) => {
    const p = { ...data, id: Date.now() };
    DB.products.push(p);
    return Promise.resolve(p);
  },
  updateProduct: (id, data) => {
    const i = DB.products.findIndex(p => p.id === id);
    if (i < 0) return Promise.reject("not found");
    DB.products[i] = { ...DB.products[i], ...data };
    return Promise.resolve(DB.products[i]);
  },
  deleteProduct: (id) => {
    DB.products = DB.products.filter(p => p.id !== id);
    return Promise.resolve();
  },
  bookProduct: (id, qty) => {
    const p = DB.products.find(x => x.id === id);
    if (!p || p.available < qty) return Promise.reject("quantità non disponibile");
    p.available -= qty;
    DB.bookings.push({ id: Date.now(), type: "product", itemId: id, userId: "user", qty, date: new Date().toISOString().slice(0,10) });
    return Promise.resolve(p);
  },

  // Users
  getUsers: () => Promise.resolve([...DB.users]),
  toggleCollaboratore: (id) => {
    const u = DB.users.find(x => x.id === id);
    if (!u) return Promise.reject("not found");
    u.role = u.role === "collaboratore" ? "utente" : "collaboratore";
    return Promise.resolve(u);
  },

};
