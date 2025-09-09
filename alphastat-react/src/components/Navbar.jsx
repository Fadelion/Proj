import { useContext, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import axiosInstance from '../api/axiosConfig';

export default function Navbar() {
  const { user, setUser, token, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch user data if we have a token but no user object
  useEffect(() => {
    if (token && !user) {
      axiosInstance.get('/auth/me')
        .then(res => {
          setUser(res.data);
          // Also set role in localStorage for PrivateRoute to work on first load
          localStorage.setItem('role', res.data.role);
        })
        .catch(() => {
          // If token is invalid, clear it
          setToken('');
          localStorage.removeItem('token');
          localStorage.removeItem('role');
        });
    }
  }, [token, user, setUser, setToken]);

  const handleLogout = () => {
    // No need to call a logout endpoint if it just invalidates the token client-side
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  const linkStyle = "px-3 py-2 rounded-md text-sm font-medium";
  const activeLinkStyle = "bg-slate-700 text-white";
  const inactiveLinkStyle = "text-slate-300 hover:bg-slate-700 hover:text-white";

  return (
    <nav className="bg-slate-900 shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="font-bold text-xl text-white">AlphaStat</Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <NavLink
                  to="/services"
                  className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : inactiveLinkStyle}`}
                >
                  Services
                </NavLink>
                {user?.role === 'client' && (
                  <NavLink
                    to="/demandes"
                    className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : inactiveLinkStyle}`}
                  >
                    Mes Demandes
                  </NavLink>
                )}
                {user?.role === 'admin' && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : inactiveLinkStyle}`}
                  >
                    Dashboard Admin
                  </NavLink>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            {!token ? (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="text-slate-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Connexion
                </Link>
                <Link to="/register" className="bg-blue-600 text-white hover:bg-blue-500 px-3 py-2 rounded-md text-sm font-medium">
                  Inscription
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-slate-400 text-sm">Bonjour, {user?.name || 'Utilisateur'}</span>
                <button
                  onClick={handleLogout}
                  className="bg-slate-700 text-white hover:bg-slate-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
