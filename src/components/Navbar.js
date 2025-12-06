import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiLogOut, FiHome } from 'react-icons/fi';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center gap-2 text-2xl font-bold">
          <FiHome /> AURA
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {user && (
            <>
              <span className="text-sm">Bem-vindo, {user.name}!</span>
              <span className="text-xs bg-blue-800 px-3 py-1 rounded">{user.role}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
              >
                <FiLogOut /> Sair
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden"
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4">
          {user && (
            <>
              <div className="text-sm">Bem-vindo, {user.name}!</div>
              <div className="text-xs bg-blue-800 px-3 py-1 rounded inline-block">{user.role}</div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
              >
                <FiLogOut /> Sair
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
