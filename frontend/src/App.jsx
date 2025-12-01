import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Páginas Públicas
import Login from './pages/Login/Login.jsx';
import EsqueciSenha from './pages/Login/EsqueciSenha.jsx';
import ResetarSenha from './pages/Login/ResetarSenha.jsx';

// Páginas Privadas
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Clientes from './pages/Clientes/Clientes.jsx';
import Quartos from './pages/Quartos/Quartos.jsx';
import Reservas from './pages/Reservas/Reservas.jsx';

// Componentes de Estrutura
import PrivateRoute from './components/PrivateRoute.jsx';
import MainLayout from './components/MainLayout.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* --- ROTAS PÚBLICAS --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
        <Route path="/resetar-senha/:token" element={<ResetarSenha />} />

        {/* --- ROTAS PRIVADAS (Protegidas por Token e Layout) --- */}
        <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/quartos" element={<Quartos />} />
            <Route path="/reservas" element={<Reservas />} />
        </Route>

        {/* Rota Padrão (Redireciona qualquer URL desconhecida para o Dashboard) */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}