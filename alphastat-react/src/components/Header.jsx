/*import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">αst@t</Link>
        <nav className="space-x-4">
          <Link to="/" className="hover:underline">Accueil</Link>
          <Link to="/services" className="hover:underline">Services</Link>
          {user ? (
            <>
              <Link to="/demande" className="hover:underline">Demande</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="hover:underline">Admin</Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Connexion</Link>
              <Link to="/register" className="hover:underline">Inscription</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
*/