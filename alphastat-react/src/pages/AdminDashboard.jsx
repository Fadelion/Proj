import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";

// Base URL for the backend storage, derived from the API config
const STORAGE_URL = "http://localhost:8000/storage";

export default function AdminDashboard() {
  const [demandes, setDemandes] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState(null); // For meta and links
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Function to fetch demands from a given URL
  const fetchDemandes = async (url = "/demandes") => {
    try {
      const res = await axiosInstance.get(url);
      setDemandes(res.data.data);
      setPagination({
        meta: res.data.meta,
        links: res.data.links,
      });
    } catch (err) {
      setError("Erreur lors du chargement des demandes");
    }
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch stats
        const resStats = await axiosInstance.get("/admin/demandes/stats");
        setStats(resStats.data.data);

        // Fetch initial demands
        await fetchDemandes();
      } catch (err) {
        setError("Erreur lors du chargement des données admin");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const updateStatut = async (id, statut) => {
    try {
      await axiosInstance.put(`/admin/demandes/${id}/status`, { statut });
      // Update the status locally without refetching
      setDemandes(demandes.map(d => (d.id === id ? { ...d, statut } : d)));
    } catch (err) {
      setError("Impossible de mettre à jour le statut");
    }
  };

  if (loading && !stats) return <p className="p-6">Chargement...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard Admin</h2>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Total demandes</p>
            <p className="text-2xl font-bold">{stats.total_demandes}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">En attente</p>
            <p className="text-2xl font-bold">{stats.demandes_en_attente}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">En cours</p>
            <p className="text-2xl font-bold">{stats.demandes_en_cours}</p>
          </div>
          <div className="bg-gray-200 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Terminées</p>
            <p className="text-2xl font-bold">{stats.demandes_terminees}</p>
          </div>
        </div>
      )}

      <h3 className="text-xl font-bold mt-6 mb-4">Toutes les demandes</h3>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Client</th>
              <th scope="col" className="px-6 py-3">Service</th>
              <th scope="col" className="px-6 py-3">Date de soumission</th>
              <th scope="col" className="px-6 py-3">Fichier joint</th>
              <th scope="col" className="px-6 py-3">Statut</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {demandes.map(d => (
              <tr key={d.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">{d.user?.name || 'N/A'}</td>
                <td className="px-6 py-4">{d.service?.title || 'N/A'}</td>
                <td className="px-6 py-4">
                  {new Date(d.date_soumission).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4">
                  {d.fichier_joint ? (
                    <a
                      href={`${STORAGE_URL}/${d.fichier_joint}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Télécharger
                    </a>
                  ) : (
                    'Aucun'
                  )}
                </td>
                <td className="px-6 py-4 font-medium">{d.statut}</td>
                <td className="px-6 py-4">
                  <select
                    value={d.statut}
                    onChange={e => updateStatut(d.id, e.target.value)}
                    className="p-1 border rounded bg-gray-50"
                  >
                    <option value="en_attente">En attente</option>
                    <option value="en_cours">En cours</option>
                    <option value="termine">Terminée</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => fetchDemandes(pagination.links.prev)}
            disabled={!pagination.links.prev}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50"
          >
            Précédent
          </button>
          <span>
            Page {pagination.meta.current_page} sur {pagination.meta.last_page}
          </span>
          <button
            onClick={() => fetchDemandes(pagination.links.next)}
            disabled={!pagination.links.next}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}
