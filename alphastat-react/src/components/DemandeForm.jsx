import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axiosInstance from '../api/axiosConfig'; // Use the configured axios instance

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

  // Fetch services if no specific service is pre-selected
  useEffect(() => {
    if (!serviceId) {
      setLoading(true);
      axiosInstance.get('/services')
        .then(response => setServices(response.data.data))
        .catch(() => setError('Erreur lors du chargement des services.'))
        .finally(() => setLoading(false));
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
      // Reset form
      setFormData({ service_id: serviceId || '', description_projet: '' });
      setFichier(null);
      // Notify parent component if needed
      if (onDemandeSubmitted) onDemandeSubmitted();

    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la soumission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white px-6 py-8 shadow-md sm:rounded-lg sm:px-10">
      <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 mb-8">
        Soumettre une nouvelle demande
      </h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {!serviceId && (
          <div>
            <label htmlFor="service_id" className="block text-sm font-medium leading-6 text-gray-900">
              Choisissez un service
            </label>
            <div className="mt-2">
              <select
                id="service_id"
                name="service_id"
                value={formData.service_id}
                onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              >
                <option value="">-- Sélectionner --</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>{service.title}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="description_projet" className="block text-sm font-medium leading-6 text-gray-900">
            Description de votre projet
          </label>
          <div className="mt-2">
            <textarea
              id="description_projet"
              name="description_projet"
              rows="4"
              required
              value={formData.description_projet}
              onChange={(e) => setFormData({ ...formData, description_projet: e.target.value })}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label htmlFor="fichier_joint" className="block text-sm font-medium leading-6 text-gray-900">
            Pièce jointe (optionnel)
          </label>
          <div className="mt-2">
            <input
              id="fichier_joint"
              name="fichier_joint"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.zip"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
          >
            {loading ? 'Envoi en cours...' : 'Soumettre la demande'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DemandeForm;
