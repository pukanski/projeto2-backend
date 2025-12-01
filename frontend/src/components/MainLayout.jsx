import React, { useContext } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function MainLayout() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="d-flex" style={{ height: '100vh' }}>
      {/* Sidebar / Menu Lateral */}
      <div className="bg-dark text-white p-3 d-flex flex-column" style={{ width: '250px' }}>
        <h4 className="mb-4">Hotel Admin</h4>
        <ul className="nav flex-column mb-auto">
          <li className="nav-item mb-2">
            <Link to="/dashboard" className="nav-link text-white">Dashboard</Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/clientes" className="nav-link text-white">Clientes</Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/quartos" className="nav-link text-white">Quartos</Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/reservas" className="nav-link text-white">Reservas</Link>
          </li>
        </ul>
        <button onClick={handleLogout} className="btn btn-outline-danger w-100 mt-3">Sair</button>
      </div>

      {/* Área de Conteúdo */}
      <div className="flex-grow-1 p-4 bg-light overflow-auto">
        <Outlet /> 
      </div>
    </div>
  );
}