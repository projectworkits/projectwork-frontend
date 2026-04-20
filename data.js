const BASE_URL = "/api";

const API = {
  // Helper for fetch
  _fetch: async (url, options = {}) => {
    const res = await fetch(BASE_URL + url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
      },
    });
    if (res.status === 204) return null;
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw err.message || "Errore API";
    }
    return res.json();
  },

  // State Mapping Helpers
  _mapPhotoToFrontend: (p) => {
    const stateMap = { available: "disponibile", booked: "prenotata", sold: "venduta" };
    return {
      ...p,
      id: p.photo_id,
      originalTitle: p.original_title,
      img: p.path,
      state: stateMap[p.state] || p.state,
      bookedBy: p.booked_by
    };
  },

  _mapPhotoToBackend: (p) => {
    const stateMap = { disponibile: "available", prenotata: "booked", venduta: "sold" };
    return {
      photo_id: p.id,
      original_title: p.originalTitle,
      path: p.img,
      title: p.title,
      year: p.year,
      place: p.place,
      description: p.description,
      price: p.price,
      state: stateMap[p.state] || p.state,
      booked_by: p.bookedBy
    };
  },

  _mapProductToFrontend: (p) => ({
    ...p,
    id: p.product_id
  }),

  // Auth
  login: async (username, password) => {
    const data = await API._fetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password })
    });
    // In un'app reale il backend ritorna i cookie HttpOnly automaticamente.
    // Qui ci serve salvare lo user per i helper di app.js
    const user = await API.getCurrentUser();
    localStorage.setItem("doisneau_session", JSON.stringify(user));
    return user;
  },

  logout: async () => {
    await API._fetch("/auth/logout");
    localStorage.removeItem("doisneau_session");
    location.href = "login.html";
  },

  getCurrentUser: () => API._fetch("/users/user"),

  // Photos
  getPhotos: async () => {
    const photos = await API._fetch("/photos/");
    return photos.map(API._fetchPhotoExtras || API._mapPhotoToFrontend);
  },

  getPhoto: async (id) => {
    const photo = await API._fetch(`/photos/${id}`);
    return API._mapPhotoToFrontend(photo);
  },

  createPhoto: async (formData) => {
    // Riceve FormData perché l'admin carica un file
    const photo = await API._fetch("/photos/upload", {
      method: "POST",
      body: formData
    });
    return API._mapPhotoToFrontend(photo);
  },

  updatePhoto: async (id, data) => {
    // Se data è una Photo oggetto frontend, mappiamo a backend
    const backendData = API._mapPhotoToBackend(data);
    const photo = await API._fetch("/photos/", {
      method: "PUT",
      body: JSON.stringify(backendData)
    });
    return photo ? API._mapPhotoToFrontend(photo) : null;
  },

  deletePhoto: (id) => API._fetch(`/photos/${id}`, { method: "DELETE" }),

  bookPhoto: async (id) => {
    const photo = await API.getPhoto(id);
    const session = getSession();
    if (!session) throw "Devi aver fatto il login per prenotare";
    
    // Aggiorniamo lo stato tramite la PUT generalizzata come confermato dall'utente
    photo.state = "prenotata";
    photo.bookedBy = session.user_id;
    return API.updatePhoto(id, photo);
  },

  cancelPhotoBooking: async (id) => {
    const photo = await API.getPhoto(id);
    photo.state = "disponibile";
    photo.bookedBy = null;
    return API.updatePhoto(id, photo);
  },

  confirmSale: async (id) => {
    const photo = await API.getPhoto(id);
    photo.state = "venduta";
    return API.updatePhoto(id, photo);
  },

  // Products
  getProducts: async () => {
    const products = await API._fetch("/products/");
    return products.map(API._mapProductToFrontend);
  },

  getProduct: async (id) => {
    const product = await API._fetch(`/products/${id}`);
    return API._mapProductToFrontend(product);
  },

  createProduct: async (data) => {
    const product = await API._fetch("/products/", {
      method: "POST",
      body: JSON.stringify(data)
    });
    return API._mapProductToFrontend(product);
  },

  updateProduct: async (id, data) => {
    // I campi id nel backend sono product_id
    const payload = { ...data, product_id: id };
    const product = await API._fetch("/products/", {
      method: "PUT",
      body: JSON.stringify(payload)
    });
    return product ? API._mapProductToFrontend(product) : null;
  },

  deleteProduct: (id) => API._fetch(`/products/${id}`, { method: "DELETE" }),

  bookProduct: async (id, qty) => {
    // README non ha un endpoint specifico per prenotare prodotti,
    // in un'app reale si farebbe una POST /orders o simili.
    // Qui cerchiamo di aggiornare la disponibilità via PUT su product.
    const p = await API.getProduct(id);
    if (p.available < qty) throw "Quantità non disponibile";
    p.available -= qty;
    p.booked = (p.booked || 0) + Number(qty);
    return API.updateProduct(id, p);
  },

  displayPrice: (price) => `${price} €`,

  // Users
  getUsers: () => API._fetch("/users/"),
  
  toggleCollaboratore: async (id) => {
    const user = await API._fetch(`/users/${id}`);
    user.collaborator = user.collaborator === 1 ? 0 : 1;
    return API._fetch("/users/", {
      method: "PUT",
      body: JSON.stringify(user)
    });
  },

};
