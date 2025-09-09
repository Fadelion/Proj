import React, { useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../contexts/AuthContext';

const DemandeForm = () => {
  const [error, setError] = useState("");
  const { token } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    service_id: '',
    description_projet: '',
    fichier_joint: null,
  });

  useEffect(() => {
    axios.get(import.meta.env.VITE_API_URL + '/services')
      .then(response => setServices(response.data.data))
      .catch(error => setError('Erreur chargement services'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const data = new FormData();
    data.append('service_id', formData.service_id);
    data.append('description_projet', formData.description_projet);
    if (formData.fichier_joint) {
      data.append('fichier_joint', formData.fichier_joint);
    }

    try {
      await axios.post(import.meta.env.VITE_API_URL + '/demandes', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setFormData({ service_id: '', description_projet: '', fichier_joint: null });
    } catch (error) {
      setError('Erreur lors de la soumission');
    }
  };

  return (
    <>
      {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 mt-6">
        <h2 className="text-xl font-bold mb-4 text-blue-600">Nouvelle Demande</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Service</label>
          <select
            value={formData.service_id}
            onChange={e => setFormData({ ...formData, service_id: e.target.value })}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">-- Sélectionner un service --</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>{service.title}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Description du projet</label>
          <textarea
            value={formData.description_projet}
            onChange={e => setFormData({ ...formData, description_projet: e.target.value })}
            className="w-full p-2 border rounded"
            rows="4"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Fichier joint</label>
          <input
            type="file"
            onChange={e => setFormData({ ...formData, fichier_joint: e.target.files[0] })}
            className="w-full p-2 border rounded"
            accept=".pdf,.doc,.docx,.zip"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Soumettre
        </button>
      </form>
    </>
  );
};

export default DemandeForm;
