import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";

const STORAGE_URL = "http://localhost:8000/storage";

const StatusBadge = ({ status }) => {
  const baseStyle = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full";
  const styles = {
    en_attente: "bg-yellow-100 text-yellow-800",
    en_cours: "bg-blue-100 text-blue-800",
    termine: "bg-green-100 text-green-800",
  };
  return <span className={`${baseStyle} ${styles[status] || 'bg-gray-100 text-gray-800'}`}>{status.replace('_', ' ')}</span>;
};

export default function Demandes() {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState(null);

  const fetchDemandes = async (url = "/demandes") => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(url);
      setDemandes(res.data.data);
      setPagination(res.data.meta);
    } catch (err) {
      setError("Erreur lors du chargement de vos demandes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemandes();
  }, []);

  if (loading) return <div className="text-center p-8">Chargement de vos demandes...</div>;
  if (error) return <div className="text-center p-8 text-accent-red">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
        Mes Demandes
      </h1>

      {demandes.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <p>Vous n'avez pas encore soumis de demande.</p>
        </div>
      ) : (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Service</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date de soumission</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Statut</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Pièce Jointe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {demandes.map((demande) => (
                <tr key={demande.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{demande.service?.title || 'N/A'}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(demande.date_soumission).toLocaleDateString('fr-FR')}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"><StatusBadge status={demande.statut} /></td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {demande.fichier_joint ? (
                      <a href={`${STORAGE_URL}/${demande.fichier_joint}`} target="_blank" rel="noopener noreferrer" className="text-primary-blue hover:text-blue-700 font-semibold">
                        Télécharger
                      </a>
                    ) : (
                      'Aucune'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
