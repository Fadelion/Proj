import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosConfig";

export default function Demandes() {
  const [services, setServices] = useState([]);
  const [description, setDescription] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axiosInstance.get("/services");
        setServices(res.data.data);
        if (res.data.data.length > 0) setServiceId(res.data.data[0].id);
      } catch (err) {
        setError("Erreur lors du chargement des services");
      }
    };
    fetchServices();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await axiosInstance.post("/demandes", { description_projet: description, service_id: serviceId });
      setMessage("Demande soumise avec succès !");
      setDescription("");
    } catch (err) {
      setError("Erreur lors de la soumission.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Soumettre une demande</h2>
      {message && <p className="mb-4 text-green-500">{message}</p>}
      {error && <p className="mb-4 text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <label>Service :</label>
        <select value={serviceId} onChange={e => setServiceId(e.target.value)} className="p-2 border">
          {services.map(s => (
            <option key={s.id} value={s.id}>{s.titre}</option>
          ))}
        </select>
        <textarea
          placeholder="Description du projet"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          className="p-2 border"
        />
        <button type="submit" className="bg-blue-600 text-white p-2 mt-2">Envoyer</button>
      </form>
    </div>
  );
}
