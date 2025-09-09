import { useEffect, useState, useCallback } from "react";
import axiosInstance from "../api/axiosConfig";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

const STORAGE_URL = "http://localhost:8000/storage";

const StatusBadge = ({ status }) => {
  const baseStyle = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full";
  const styles = {
    en_attente: "bg-yellow-100 text-yellow-800",
    en_cours: "bg-blue-100 text-blue-800",
    termine: "bg-accent-green text-green-800", // Using new accent-green
  };
  const formattedStatus = status.replace('_', ' ');
  return <span className={`${baseStyle} ${styles[status] || 'bg-gray-100 text-gray-800'}`}>{formattedStatus}</span>;
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white overflow-hidden shadow-md rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="text-3xl font-semibold text-gray-900">{value}</dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [demandes, setDemandes] = useState([]);
  const [stats, setStats] = useState(null);
  const [_pagination, setPagination] = useState(null); // Prefix with _ to indicate intentionally unused
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDemandes = useCallback(async (url = "/demandes") => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(url);
      setDemandes(res.data.data);
      setPagination({ meta: res.data.meta, links: res.data.links });
    } catch (_err) {
      setError("Erreur lors du chargement des demandes");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAdminData = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const resStats = await axiosInstance.get("/admin/demandes/stats");
      setStats(resStats.data.data);
      await fetchDemandes();
    } catch (_err) {
      setError("Erreur lors du chargement des données admin");
    } finally {
      setLoading(false);
    }
  }, [fetchDemandes]);

  // Add fetchDemandes to the dependency array of its own useCallback
  const fetchDemandesMemoized = useCallback(fetchDemandes, [fetchDemandes]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const updateStatut = async (id, statut) => {
    try {
      const res = await axiosInstance.put(`/admin/demandes/${id}/status`, { statut });
      setDemandes(demandes.map(d => (d.id === id ? res.data.data : d)));
    } catch (_err) {
      setError("Impossible de mettre à jour le statut");
    }
  };

  if (loading && !stats) return <div className="p-6 text-center">Chargement...</div>;
  if (error) return <div className="p-6 text-center text-accent-red bg-red-50 rounded-md">{error}</div>;

  const statIcons = { /* ... icon definitions ... */ };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">Dashboard Administrateur</h1>

      {stats && (
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total des demandes" value={stats.total_demandes} icon={statIcons.total} />
          <StatCard title="Demandes en attente" value={stats.demandes_en_attente} icon={statIcons.pending} />
          <StatCard title="Demandes en cours" value={stats.demandes_en_cours} icon={statIcons.in_progress} />
          <StatCard title="Demandes terminées" value={stats.demandes_terminees} icon={statIcons.completed} />
        </dl>
      )}

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {demandes.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{d.user?.name || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{d.service?.title || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(d.date_soumission).toLocaleDateString('fr-FR')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><StatusBadge status={d.statut} /></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                        {d.fichier_joint && (
                          <a href={`${STORAGE_URL}/${d.fichier_joint}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-blue" title="Télécharger la pièce jointe">
                            <ArrowDownTrayIcon className="h-5 w-5 inline-block" />
                          </a>
                        )}
                        <select value={d.statut} onChange={e => updateStatut(d.id, e.target.value)} className="p-1 border-gray-300 rounded-md text-sm focus:ring-primary-blue focus:border-primary-blue">
                          <option value="en_attente">En attente</option>
                          <option value="en_cours">En cours</option>
                          <option value="termine">Terminée</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination can be added here if needed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
