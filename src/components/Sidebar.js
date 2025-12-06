import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiFileText,
  FiTruck,
  FiBarChart2,
  FiSettings,
  FiUsers,
  FiDollarSign,
  FiPackage,
} from 'react-icons/fi';

export const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const menuItems = {
    support: [
      { name: 'OS Abertas', path: '/dashboard/os', icon: <FiFileText /> },
      { name: 'Técnicos', path: '/dashboard/tecnicos', icon: <FiUsers /> },
    ],
    supply: [
      { name: 'Peças', path: '/dashboard/pecas', icon: <FiPackage /> },
      { name: 'Notas de Entrega', path: '/dashboard/notas-entrega', icon: <FiFileText /> },
      { name: 'Fornecedores', path: '/dashboard/fornecedores', icon: <FiTruck /> },
      { name: 'Pedidos', path: '/dashboard/pedidos', icon: <FiFileText /> },
    ],
    counter: [
      { name: 'Máquinas', path: '/dashboard/maquinas', icon: <FiSettings /> },
      { name: 'Clientes', path: '/dashboard/clientes', icon: <FiUsers /> },
      { name: 'Contratos', path: '/dashboard/contratos', icon: <FiFileText /> },
      { name: 'Contadores', path: '/dashboard/contadores', icon: <FiBarChart2 /> },
      { name: 'Relatório', path: '/dashboard/relatorio', icon: <FiBarChart2 /> },
    ],
    billing: [
      { name: 'Faturamentos', path: '/dashboard/faturamentos', icon: <FiDollarSign /> },
      { name: 'Boletos', path: '/dashboard/boletos', icon: <FiFileText /> },
    ],
    technician: [
      { name: 'Minhas OS', path: '/dashboard/minhas-os', icon: <FiFileText /> },
      { name: 'Solicitações', path: '/dashboard/solicitacoes', icon: <FiPackage /> },
    ],
    admin: [
      { name: 'Dashboard', path: '/dashboard', icon: <FiBarChart2 /> },
      { name: 'Usuários', path: '/dashboard/usuarios', icon: <FiUsers /> },
      { name: 'Máquinas', path: '/dashboard/maquinas', icon: <FiSettings /> },
      { name: 'Clientes', path: '/dashboard/clientes', icon: <FiUsers /> },
      { name: 'Técnicos', path: '/dashboard/tecnicos', icon: <FiUsers /> },
      { name: 'Relatório', path: '/dashboard/relatorio', icon: <FiBarChart2 /> },
    ],
  };

  const items = menuItems[user?.role] || [];

  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen p-6 shadow-lg">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-blue-400">Menu</h2>
      </div>

      <nav className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              location.pathname === item.path
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};
