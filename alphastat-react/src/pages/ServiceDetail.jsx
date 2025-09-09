import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axiosInstance.get(`/services/${id}`);
        setService(res.data.data);
      } catch (err) {
        setError("Erreur lors du chargement du service");
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  if (loading) return <p className="p-6">Chargement du service...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!service) return <p className="p-6">Service introuvable</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{service.title}</h2>
      <p>{service.description}</p>
      <p className="mt-2 font-semibold">Prix indicatif: {service.prix_indicatif}</p>
    </div>
  );
}
