import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import { AuthContext } from "../contexts/AuthContext";
import DemandeForm from "../components/DemandeForm";

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axiosInstance.get(`/services/${id}`);
        setService(res.data.data);
      } catch (err) {
        setError("Erreur lors du chargement du service.");
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  if (loading) return <div className="text-center p-8">Chargement du service...</div>;
  if (error) return <div className="text-center p-8 text-accent-red">{error}</div>;
  if (!service) return <div className="text-center p-8">Service introuvable.</div>;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left side: Service Details */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{service.title}</h1>
            <p className="mt-4 text-lg text-gray-600">
              {service.description}
            </p>
            <p className="mt-6 text-2xl font-bold text-gray-800">
              {service.prix_indicatif} €
              <span className="ml-2 text-base font-normal text-gray-500">(prix indicatif)</span>
            </p>
          </div>
        </div>

        {/* Right side: Demande Form or Login Prompt */}
        <div className="lg:col-span-1">
          {user ? (
            <DemandeForm serviceId={id} />
          ) : (
            <div className="bg-white shadow-lg rounded-lg p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900">Intéressé par ce service ?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Connectez-vous ou créez un compte pour soumettre une demande de devis.
              </p>
              <Link
                to="/login"
                className="mt-4 inline-block w-full text-center rounded-md bg-primary-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                Se connecter
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
