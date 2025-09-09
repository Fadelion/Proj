import { Link } from 'react-router-dom';

function Navbar() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <nav className="p-4 bg-blue-800 text-white flex justify-between">
      <div className="flex gap-4 items-center">
        <Link to="/" className="font-bold text-lg">AlphaStat</Link>
        <Link to="/services" className="hover:underline">Services</Link>
        {token && role === 'client' && <Link to="/demandes" className="hover:underline">Demandes</Link>}
      </div>
      <div className="flex gap-4 items-center">
        {!token ? (
          <>
            <Link to="/login" className="hover:underline">Connexion</Link>
            <Link to="/register" className="hover:underline">Inscription</Link>
          </>
        ) : (
          role === 'admin' ? <Link to="/admin" className="hover:underline">Admin</Link> : null
        )}
      </div>
    </nav>
  )
}

export default Navbar;
