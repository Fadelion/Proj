import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axiosInstance from '../api/axiosConfig';

const DemandeForm = ({ serviceId, onDemandeSubmitted }) => {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    service_id: serviceId || '',
    description_projet: '',
  });
  const [fichier, setFichier] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (!serviceId) {
      axiosInstance.get('/services')
        .then(response => setServices(response.data.data))
        .catch(() => setError('Erreur lors du chargement des services.'));
    }
  }, [serviceId]);

  const handleFileChange = (e) => {
    setFichier(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const submissionData = new FormData();
    submissionData.append('service_id', formData.service_id);
    submissionData.append('description_projet', formData.description_projet);
    if (fichier) {
      submissionData.append('fichier_joint', fichier);
    }

    try {
      await axiosInstance.post('/demandes', submissionData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Votre demande a été soumise avec succès !');
      setFormData({ service_id: serviceId || '', description_projet: '' });
      setFichier(null);
      if (onDemandeSubmitted) onDemandeSubmitted();

    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la soumission.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "mt-1 block w-full px-3 py-2 bg-white border border-neutral-light rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue";
  const labelClass = "block text-sm font-medium text-gray-700";
  const buttonClass = "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue disabled:opacity-50";

  return (
    <div className="bg-white px-6 py-8 shadow-lg sm:rounded-lg sm:px-10">
      <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 mb-8">
        Soumettre une nouvelle demande
      </h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {!serviceId && (
          <div>
            <label htmlFor="service_id" className={labelClass}>
              Choisissez un service
            </label>
            <select
              id="service_id"
              name="service_id"
              value={formData.service_id}
              onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
              required
              className={inputClass}
            >
              <option value="">-- Sélectionner --</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>{service.title}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="description_projet" className={labelClass}>
            Description de votre projet
          </label>
          <textarea
            id="description_projet"
            name="description_projet"
            rows="4"
            required
            value={formData.description_projet}
            onChange={(e) => setFormData({ ...formData, description_projet: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="fichier_joint" className={labelClass}>
            Pièce jointe (optionnel)
          </label>
          <input
            id="fichier_joint"
            name="fichier_joint"
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.zip"
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary-blue hover:file:bg-blue-100"
          />
        </div>

        {error && <p className="text-sm text-accent-red">{error}</p>}
        {success && <p className="text-sm text-accent-green">{success}</p>}

        <div>
          <button
            type="submit"
            disabled={loading}
            className={buttonClass}
          >
            {loading ? 'Envoi en cours...' : 'Soumettre la demande'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DemandeForm;
