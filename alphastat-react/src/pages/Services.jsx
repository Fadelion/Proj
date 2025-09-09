import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";
import ServiceCard from "../components/ServiceCard"; // Import the redesigned component

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
        setError("Erreur lors du chargement des services.");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) return <div className="text-center p-8">Chargement des services...</div>;
  if (error) return <div className="text-center p-8 text-accent-red">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
        Nos Services
      </h1>

      {services.length === 0 && !loading && (
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <p>Aucun service n'est disponible pour le moment.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}
