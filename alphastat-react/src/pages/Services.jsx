import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { Link } from "react-router-dom";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axiosInstance.get("/services");
        setServices(res.data.data);
      } catch (err) {
        setError("Erreur lors du chargement des services");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) return <p className="p-6">Chargement des services...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (services.length === 0) return <p className="p-6">Aucun service disponible.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Services disponibles</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map(s => (
          <li key={s.id} className="p-4 border rounded shadow hover:shadow-lg">
            <h3 className="font-bold text-lg">{s.titre}</h3>
            <p>{s.description}</p>
            <p className="mt-1 font-semibold">Prix indicatif: {s.prix_indicatif}</p>
            <Link to={`/services/${s.id}`} className="text-blue-600 mt-2 inline-block">Voir détail</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
