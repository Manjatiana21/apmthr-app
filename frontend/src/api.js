// frontend/src/api.js
import axios from "axios";


// ✅ Instance axios avec configuration de base
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  // headers: { "Content-Type": "application/json" },
});


// =======================
// 📌 Refresh Token
// =======================
export const refreshToken = (refresh) =>
  api.post("/comptes/token/refresh/", { refresh });

// =======================
// 📌 Intercepteur Request
// =======================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (
    token &&
    !config.url.includes("/login") &&
    !config.url.includes("/register") &&
    !config.url.includes("/token/refresh")
  ) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("🔑 Header Authorization ajouté:", config.headers.Authorization);
  } else {
    console.log("⚠️ Pas de token ajouté pour:", config.url);
  }

  return config;
});

// =======================
// 📌 Intercepteur Response (refresh automatique)
// =======================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem("refresh_token");

      if (refresh) {
        try {
          const res = await refreshToken(refresh);
          localStorage.setItem("access_token", res.data.access);
          api.defaults.headers.Authorization = `Bearer ${res.data.access}`;
          console.log("🔄 Nouveau access_token généré via refresh");
          return api(originalRequest);
        } catch (err) {
          console.error("❌ Refresh token invalide:", err.response?.data || err);
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

// =======================
// 📌 Authentification
// =======================
export const login = (data) => api.post("/comptes/login/", data);
export const register = (data) => api.post("/comptes/register/", data);
export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("role");
};


// Liste des utilisateurs
export const getUsers = async () => {
  const res = await api.get("/comptes/utilisateurs/");
  return res.data;
};

export const reactivateUser = async (id) => {
  const res = await api.post(`/comptes/utilisateurs/${id}/reactiver/`);
  return res.data;
};

export const suspendUser = async (id, reason) => {
  const res = await api.post(`/comptes/utilisateurs/${id}/suspendre/`, { raison: reason });
  return res.data;
};

// =======================
// 📌 Utilisateur connecté
// =======================
export const getMe = () => api.get("/me/");


// =======================
// 📌 Modifications Profil
// =======================

// Modifier le nom
export const modifierNom = (username) =>
  api.put("/profil/modifier-nom/", { username });

// Modifier le téléphone
export const modifierTelephone = (telephone) =>
  api.put("/profil/modifier-telephone/", { telephone });

// Modifier l’adresse
export const modifierAdresse = (adresse) =>
  api.put("/profil/modifier-adresse/", { adresse });

// Modifier l’email
export const modifierEmail = (email) =>
  api.put("/profil/modifier-email/", { email });

// Modifier le mot de passe
export const modifierMotdepasse = (old_password, new_password) =>
  api.put("/profil/modifier-motdepasse/", { old_password, new_password });

// =======================
// 📌 Produits (Catalogue)
// =======================
// Produits
export const getProduits = () => api.get("/produits/?is_active=true");
export const getProduitById = (id) => api.get(`/produits/${id}/`);
export const getProduitsParType = (typeId) => api.get(`/produits/type/${typeId}/`);

export const getProduitsArchives = () => api.get("/produits/?is_active=false");
export const reactiverProduit = (id) => api.post(`/produits/${id}/reactiver/`);

export const addProduit = (data) =>
  api.post("/produits/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ⚠️ Tu peux soit garder les manuelles :
export const modifierProduit = (id, data) =>
  api.patch(`/produits/${id}/modifier/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const supprimerProduit = (id) => api.delete(`/produits/${id}/supprimer/`);

export const updateProduit = (id, data) =>
  api.patch(`/produits/${id}/`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });


export const deleteProduit = (id) => api.delete(`/produits/${id}/`);

// Types Produits
export const getTypesProduits = () => api.get("/types-produits/");

// Fournisseurs
export const getFournisseurs = () => api.get("/fournisseurs/");

// =======================
// 📌 Commandes
// =======================

// --- Commandes côté admin ---
export const getCommandesAdmin = () => api.get("/commandes/");
export const validerCommande = (id) => api.post(`/commandes/${id}/valider/`);
export const annulerCommande = (id) => api.post(`/commandes/${id}/annuler/`);

export const getCommandesValideesAdmin = () => api.get("/commandes-validees-admin/");
export const getCommandesAnnuleesAdmin = () => api.get("/commandes-annulees-admin/");
export const getCommandeDetailAdmin = (id) => api.get(`/commandes/${id}/detail-admin/`);
export const deleteCommande = async (id) => {
  const res = await api.delete(`/commandes/${id}/`);
  return res.data;
};


// --- Commandes côté client ---
export const getCommandesClient = () => api.get("/commandes/client/");
export const getCommandesAnnulees = () => api.get("/commandes/annulees/");

export const passerCommande = (data) =>
  api.post(`/commandes/${data.produit}/passer/`, data, {
    headers: { "Content-Type": "application/json" },
  });

  
// Passer une commande avec plusieurs produits
export const passerCommandeMultiple = (produits) =>
  api.post("/commandes/passer-multiple/", { produits });

export const annulerCommandeClient = (id) =>
  api.post(`/commandes/${id}/annuler-client/`);

// --- Suppression en masse (admin) ---
export const deleteCommandesSelection = (ids) =>
  api.delete("/commandes/effacer-selection/", { data: { ids } });

// =======================
// 📌 Panier
// =======================

// Consulter le panier du client (commande en attente)
export const consulterPanier = async () => {
  const res = await api.get("/commande/panier/consulter/");
  return res.data;
};

// Ajouter/valider le panier (commande multiple)
export const validerPanier = async (produits, adresseLivraison, modePaiementId) => {
  const payload = {
    produits: produits.map((item) => ({
      produit_id: item.produit_id || item.id,  // ✅ fallback pour garantir la clé
      quantite: item.quantite,
    })),
    adresse_livraison: adresseLivraison,
    mode_paiement: modePaiementId,
  };

  console.log("Payload envoyé au backend:", payload); // ✅ debug pour vérifier

  const res = await api.post("/commande/panier/ajouter/", payload);
  return res.data;
};

// Vider le panier (optionnel)
export const viderPanier = async () => {
  const res = await api.post("/commande/panier/vider/");
  return res.data;
};


// =======================
// 📌 Paiements
// =======================
export const getPaiementsClient = () => api.get("/paiements/");

export const getPaiementsAdmin = async () => {
  const res = await api.get("/gestion-paiements/");
  return res.data;
};

export const validerPaiement = async (id) => {
  const res = await api.post(`/paiements/${id}/valider/`);
  return res.data;
};

export const annulerPaiement = async (id) => {
  const res = await api.post(`/paiements/${id}/annuler/`);
  return res.data;
};

export const genererFacture = async (id) => {
  const res = await api.post(`/comptes/paiements/${id}/generer-facture/`);
  return res.data;
};

export const getPaiementDetail = async (id) => {
  const res = await api.get(`/comptes/paiements/${id}/`);
  return res.data;
};

export const envoyerFacture = async (factureId) => {
  const res = await api.post(`/comptes/factures/${factureId}/envoyer/`);
  return res.data;
};

// Récupérer les factures du client
export const getFacturesRecues = async () => {
  const res = await api.get("/comptes/factures/recues/");
  return res.data;
};

// Télécharger une facture en PDF
export const downloadFacturePDF = async (factureId) => {
  const res = await api.get(`/comptes/factures/${factureId}/pdf/`, {
    responseType: "blob",
  });
  return res.data;
};

export async function getFactureDetail(facture_id) {
  const res = await api.get(`/comptes/factures/${facture_id}/`);
  return res.data;
}


export const facturePaiement = (id) => api.get(`/paiements/${id}/facture/`);
export const getModesPaiement = () => api.get("/modes-paiement/");

// ✅ Utiliser axios avec l'instance configurée
export async function getAllFactures() {
  try {
    const res = await api.get("/comptes/factures/");
    return res.data; // axios renvoie déjà les données dans res.data
  } catch (err) {
    throw new Error("Erreur API factures");
  }
}

// =======================
// 📌 Livraisons
// =======================

export const getLivraisonsAdmin = () => api.get("/livraisons/");
export const getLivraisonsClient = () => api.get("/livraisons/client/");
export const updateLivraisonStatut = (livraisonId, statut) =>
  api.patch(`/livraisons/${livraisonId}/update-statut/`, { statut });

export const demarrerLivraison = (id) => api.post(`/livraisons/${id}/demarrer/`);
export const terminerLivraison = (id) => api.post(`/livraisons/${id}/terminer/`);
export const planifierLivraison = (commandeId) =>
  api.post(`/livraisons/${commandeId}/planifier/`);

// =======================
// 📌 Stocks
// =======================
export const getMouvementsStock = () => api.get("/stocks/");



export const getRapportMouvements = () => api.get("/stocks/rapport/");


// =======================
// 📌 Notifications
// =======================

// =======================
// 🔔 Notifications Client
// =======================
export const getMesNotifications = async () => {
  const res = await api.get("/comptes/mes-notifications/");
  return res.data;
};

export const marquerNotificationClientLue = async (id) => {
  const res = await api.post(`/comptes/notifications/${id}/marquer-lue/`);
  return res.data;
};

export const marquerToutesNotificationsClientLues = async () => {
  const res = await api.post("/comptes/notifications/marquer-tout-lu/");
  return res.data;
};

// =======================
// 🔔 Notifications Admin
// =======================
export const getNotificationsAdmin = async () => {
  const res = await api.get("/comptes/notifications/admin/");
  return res.data;
};

export const marquerNotificationAdminLue = async (id) => {
  const res = await api.post(`/comptes/notifications/${id}/marquer-lue/`);
  return res.data;
};

export const marquerToutesNotificationsAdminLues = async () => {
  const res = await api.post("/comptes/notifications/marquer-tout-lu/");
  return res.data;
};




// =======================
// 📌 Utilisateurs
// =======================
export const getUtilisateurs = () => api.get("/utilisateurs/");

// =======================
// 📌 Admin - Stats
// =======================
export const getAdminStats = () => api.get("/admin/stats/");


export default api;
