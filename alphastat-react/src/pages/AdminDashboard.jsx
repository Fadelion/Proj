import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { Link } from "react-router-dom";

const STORAGE_URL = "http://localhost:8000/storage";

// Helper component for status badges
const StatusBadge = ({ status }) => {
  const baseStyle = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full";
  const styles = {
    en_attente: "bg-yellow-100 text-yellow-800",
    en_cours: "bg-blue-100 text-blue-800",
    termine: "bg-green-100 text-green-800",
  };
  return <span className={`${baseStyle} ${styles[status] || 'bg-gray-100 text-gray-800'}`}>{status.replace('_', ' ')}</span>;
};

// Helper component for stat cards
const StatCard = ({ title, value, icon }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {icon}
        </div>
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
  const [pagination, setPagination] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDemandes = async (url = "/demandes") => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(url);
      setDemandes(res.data.data);
      setPagination({ meta: res.data.meta, links: res.data.links });
    } catch (err) {
      setError("Erreur lors du chargement des demandes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      setError("");
      try {
        const resStats = await axiosInstance.get("/admin/demandes/stats");
        setStats(resStats.data.data);
        await fetchDemandes();
      } catch (err) {
        setError("Erreur lors du chargement des données admin");
      }
    };
    fetchAdminData();
  }, []);

  const updateStatut = async (id, statut) => {
    try {
      const res = await axiosInstance.put(`/admin/demandes/${id}/status`, { statut });
      setDemandes(demandes.map(d => (d.id === id ? res.data.data : d)));
    } catch (err) {
      setError("Impossible de mettre à jour le statut");
    }
  };

  if (!stats && loading) return <div className="p-6 text-center">Chargement du tableau de bord...</div>;
  if (error) return <div className="p-6 text-center text-red-500 bg-red-50 rounded-md">{error}</div>;

  const statIcons = {
    total: <svg className="h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
    pending: <svg className="h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    in_progress: <svg className="h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5" /></svg>,
    completed: <svg className="h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  };

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold leading-6 text-gray-900">Dashboard Administrateur</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          {stats && (
            <div>
              <h3 className="text-base font-semibold leading-6 text-gray-900">Statistiques générales</h3>
              <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total des demandes" value={stats.total_demandes} icon={statIcons.total} />
                <StatCard title="Demandes en attente" value={stats.demandes_en_attente} icon={statIcons.pending} />
                <StatCard title="Demandes en cours" value={stats.demandes_en_cours} icon={statIcons.in_progress} />
                <StatCard title="Demandes terminées" value={stats.demandes_terminees} icon={statIcons.completed} />
              </dl>
            </div>
          )}

          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Client</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Service</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Statut</th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {demandes.map((d) => (
                        <tr key={d.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{d.user?.name || 'N/A'}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{d.service?.title || 'N/A'}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(d.date_soumission).toLocaleDateString('fr-FR')}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"><StatusBadge status={d.statut} /></td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            {d.fichier_joint && (
                              <a href={`${STORAGE_URL}/${d.fichier_joint}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900 mr-4">
                                Voir PJ
                              </a>
                            )}
                            <select value={d.statut} onChange={e => updateStatut(d.id, e.target.value)} className="p-1 border-gray-300 rounded text-sm">
                              <option value="en_attente">En attente</option>
                              <option value="en_cours">En cours</option>
                              <option value="termine">Terminée</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {pagination && (
                    <nav className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6" aria-label="Pagination">
                      <div className="hidden sm:block">
                        <p className="text-sm text-gray-700">
                          Affichage de <span className="font-medium">{pagination.meta.from}</span> à <span className="font-medium">{pagination.meta.to}</span> sur <span className="font-medium">{pagination.meta.total}</span> résultats
                        </p>
                      </div>
                      <div className="flex flex-1 justify-between sm:justify-end">
                        <button onClick={() => fetchDemandes(pagination.links.prev)} disabled={!pagination.links.prev} className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 disabled:opacity-50">
                          Précédent
                        </button>
                        <button onClick={() => fetchDemandes(pagination.links.next)} disabled={!pagination.links.next} className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 disabled:opacity-50">
                          Suivant
                        </button>
                      </div>
                    </nav>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
