
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
  ],

  // ── USERS ──
  users: [
    { id: 1, name: "Giulia Ferretti", email: "giulia@example.com", role: "collaboratore" },
    { id: 2, name: "Marco Santini",   email: "marco@example.com",   role: "utente" },
  ],

  // ── BOOKINGS ──
  bookings: [
    { id: 1, type: "photo",   itemId: 2, userId: "user", qty: 1, date: "2026-04-01" },
    { id: 2, type: "photo",   itemId: 8, userId: "user", qty: 1, date: "2026-04-03" },
    { id: 3, type: "product", itemId: 3, userId: "user", qty: 2, date: "2026-04-05" },
  ],

};

// da sostituire con API reali, mock API
const API = {
  
  // Photos
  getPhotos: () => Promise.resolve([...DB.photos]),
  getPhoto:  (id) => Promise.resolve(DB.photos.find(p => p.id === id) || null),
  createPhoto: (data) => {
    const stringint = `${data.price}`;
    const p = { ...data, id: Date.now(), price: stringint, state: "disponibile", bookedBy: null };
    DB.photos.push(p);
    return Promise.resolve(p);
  },
  updatePhoto: (id, data) => {
    const i = DB.photos.findIndex(p => p.id === id);
    if (i < 0) return Promise.reject("not found");

    if (data.price){
      data.price = `${data.price}`;
    }

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
    const stringint = `${data.price}`;
    const p = { ...data, id: Date.now(), price: stringint };
    DB.products.push(p);
    return Promise.resolve(p);
  },
  updateProduct: (id, data) => {
    const i = DB.products.findIndex(p => p.id === id);
    if (i < 0) return Promise.reject("not found");

    if (data.price) {
      data.price = `${data.price}`;
    }

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
  displayPrice: (price) => {
    return `${price} €`;
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
