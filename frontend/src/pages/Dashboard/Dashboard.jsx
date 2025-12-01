import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Spinner } from 'react-bootstrap';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalClientes: 0,
    quartosDisponiveis: 0,
    totalQuartos: 0,
    reservasAtivas: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const [resClientes, resQuartos, resReservas] = await Promise.all([
        api.get('/clientes'),
        api.get('/quartos'),
        api.get('/reservas')
      ]);

      const clientes = resClientes.data;
      const quartos = resQuartos.data;
      const reservas = resReservas.data;

      const quartosLivres = quartos.filter(q => q.status === 'Disponivel').length;
      const reservasAtivas = reservas.filter(r => r.status === 'Pendente' || r.status === 'Confirmada').length;

      setStats({
        totalClientes: clientes.length,
        quartosDisponiveis: quartosLivres,
        totalQuartos: quartos.length,
        reservasAtivas: reservasAtivas
      });
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err);
      setError('Não foi possível carregar os dados atualizados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <Spinner animation="border" style={{ color: 'var(--cor-secundaria)' }} />
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <h2 className="mb-4" style={{ color: 'var(--cor-principal)' }}>Visão Geral</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row mb-4">
        
        {/* Card Clientes */}
        <div className="col-md-4">
          <div className="card text-white h-100 shadow-sm" style={{ backgroundColor: 'var(--cor-principal)' }}>
            <div className="card-header border-0 d-flex justify-content-between align-items-center">
              <span>Clientes Cadastrados</span>
              <span style={{ fontSize: '1.5rem' }}>👥</span>
            </div>
            <div className="card-body">
              <h1 className="card-title display-4 fw-bold" style={{ color: 'var(--cor-secundaria)' }}>
                {stats.totalClientes}
              </h1>
              <p className="card-text text-white-50">Total de clientes na base.</p>
            </div>
          </div>
        </div>

        {/* Card Quartos */}
        <div className="col-md-4">
          <div className="card text-white h-100 shadow-sm" style={{ backgroundColor: 'var(--cor-principal)' }}>
            <div className="card-header border-0 d-flex justify-content-between align-items-center">
              <span>Quartos Disponíveis</span>
              <span style={{ fontSize: '1.5rem' }}>🛏️</span>
            </div>
            <div className="card-body">
              <h1 className="card-title display-4 fw-bold" style={{ color: 'var(--cor-secundaria)' }}>
                {stats.quartosDisponiveis}
                <span className="fs-4 text-white-50"> / {stats.totalQuartos}</span>
              </h1>
              <p className="card-text text-white-50">Quartos prontos para reserva agora.</p>
            </div>
          </div>
        </div>

        {/* Card Reservas */}
        <div className="col-md-4">
          <div className="card text-white h-100 shadow-sm" style={{ backgroundColor: 'var(--cor-principal)' }}>
            <div className="card-header border-0 d-flex justify-content-between align-items-center">
              <span>Reservas Ativas</span>
              <span style={{ fontSize: '1.5rem' }}>📅</span>
            </div>
            <div className="card-body">
              <h1 className="card-title display-4 fw-bold" style={{ color: 'var(--cor-secundaria)' }}>
                {stats.reservasAtivas}
              </h1>
              <p className="card-text text-white-50">Hóspedes pendentes ou confirmados.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-bottom">
          <h5 className="mb-0" style={{ color: 'var(--cor-principal)' }}>Ações Rápidas</h5>
        </div>
        <div className="card-body">
          <div className="d-grid gap-3 d-md-flex">
            
            <Link to="/clientes" className="btn btn-lg flex-grow-1" 
              style={{ backgroundColor: 'var(--cor-principal)', color: 'white' }}>
              👥 Gerenciar Clientes
            </Link>
            
            <Link to="/quartos" className="btn btn-lg flex-grow-1"
              style={{ backgroundColor: 'var(--cor-principal)', color: 'white' }}>
              🛏️ Gerenciar Quartos
            </Link>
            
            <Link to="/reservas" className="btn btn-lg flex-grow-1"
              style={{ backgroundColor: 'var(--cor-principal)', color: 'white' }}>
              📅 Nova Reserva
            </Link>

          </div>
        </div>
      </div>
      
      <div className="mt-4 text-muted small">
        <strong>Status do Sistema:</strong> Conectado à API em <code>{api.defaults.baseURL}</code>
      </div>
    </div>
  );
}