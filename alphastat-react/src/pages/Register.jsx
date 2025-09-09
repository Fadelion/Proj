import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await axiosInstance.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate("/login", { state: { message: "Inscription réussie ! Vous pouvez maintenant vous connecter." } });
    } catch (err) {
      const apiError = err.response?.data?.message || "Une erreur est survenue lors de l'inscription.";
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    { id: "name", name: "name", type: "text", label: "Nom complet", autoComplete: "name" },
    { id: "email", name: "email", type: "email", label: "Adresse e-mail", autoComplete: "email" },
    { id: "password", name: "password", type: "password", label: "Mot de passe", autoComplete: "new-password" },
    { id: "password_confirmation", name: "password_confirmation", type: "password", label: "Confirmez le mot de passe", autoComplete: "new-password" },
  ];

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Créez votre compte
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-6 py-8 shadow-lg sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {formFields.map(field => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <div className="mt-1">
                  <input
                    id={field.id}
                    name={field.name}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    required
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-neutral-light rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue"
                  />
                </div>
              </div>
            ))}

            {error && <p className="text-sm text-accent-red">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue disabled:opacity-50"
              >
                {loading ? 'Création du compte...' : 'S\'inscrire'}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Déjà membre ?{' '}
            <Link to="/login" className="font-semibold leading-6 text-primary-blue hover:text-blue-700">
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
