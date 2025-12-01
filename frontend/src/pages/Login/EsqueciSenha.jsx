import React, { useState } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';

export default function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      await api.post('/esqueciSenha', { email });
      setMessage('Verifique o console do servidor (backend) para pegar o link de reset.');
    } catch (err) {
      setError('Erro ao solicitar recuperação. Verifique o email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-sm" style={{ width: '400px', borderTop: '5px solid var(--cor-secundaria)' }}>
        <div className="card-body p-4">
          <h3 className="text-center mb-3">Recuperar Senha</h3>
          <p className="text-muted text-center mb-4">Informe seu e-mail para receber o link.</p>

          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-control" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Link'}
              </button>
              <Link to="/login" className="btn btn-link text-decoration-none">
                Voltar para Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}