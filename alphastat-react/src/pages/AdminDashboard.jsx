import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";

export default function AdminDashboard() {
  const [demandes, setDemandes] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const resStats = await axiosInstance.get("/admin/demandes/stats");
        setStats(resStats.data.data);

        const resDemandes = await axiosInstance.get("/demandes");
        setDemandes(resDemandes.data.data);
      } catch (err) {
        setError("Erreur lors du chargement des données admin");
      }
    };
    fetchAdminData();
  }, []);

  const updateStatut = async (id, statut) => {
    try {
      await axiosInstance.put(`/admin/demandes/${id}/status`, { statut });
      setDemandes(demandes.map(d => d.id === id ? { ...d, statut } : d));
    } catch (err) {
      setError("Impossible de mettre à jour le statut");
    }
  };

  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!stats) return <p className="p-6">Chargement...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard Admin</h2>
      <p>Total demandes: {stats.total_demandes}</p>
      <p>En attente: {stats.demandes_en_attente}</p>
      <p>En cours: {stats.demandes_en_cours}</p>
      <p>Terminées: {stats.demandes_terminees}</p>

      <h3 className="mt-4 font-bold">Toutes les demandes</h3>
      <ul className="space-y-2">
        {demandes.map(d => (
          <li key={d.id} className="border p-2 rounded flex justify-between items-center">
            <span>{d.description_projet} - <strong>{d.statut}</strong></span>
            <select value={d.statut} onChange={e => updateStatut(d.id, e.target.value)} className="p-1 border">
              <option value="en_attente">En attente</option>
              <option value="en_cours">En cours</option>
              <option value="termine">Terminée</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}
