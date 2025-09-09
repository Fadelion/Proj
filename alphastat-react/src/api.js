import axios from "axios";

// 🔗 URL de ton backend Laravel via variable d'environnement
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Instance Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔑 Ajouter automatiquement le token JWT dans chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================
// AUTH
// ============================

// Inscription
export const register = (data) => api.post("/auth/register", data);

// Connexion
export const login = async (data) => {
  const response = await api.post("/auth/login", data);
  if (response.data.access_token) {
    localStorage.setItem("token", response.data.access_token);
  }
  return response.data;
};

// Déconnexion
export const logout = async () => {
  await api.post("/auth/logout");
  localStorage.removeItem("token");
};

// Profil utilisateur connecté
export const getProfile = () => api.get("/auth/me");

// ============================
// SERVICES
// ============================

export const fetchServices = () => api.get("/services");
export const fetchService = (id) => api.get(`/services/${id}`);

// ============================
// DEMANDES (client)
// ============================

export const fetchDemandes = () => api.get("/demandes");
export const createDemande = (data) => api.post("/demandes", data);
export const fetchDemande = (id) => api.get(`/demandes/${id}`);
export const deleteDemande = (id) => api.delete(`/demandes/${id}`);

// ============================
// ADMIN (demandes + stats)
// ============================

export const updateDemandeStatus = (id, statut) =>
  api.put(`/admin/demandes/${id}/status`, { statut });

export const fetchStats = () => api.get("/admin/demandes/stats");

export default api;
