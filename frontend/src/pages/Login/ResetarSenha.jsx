import React, { useState } from 'react';
import api from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function ResetarSenha() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [novaSenha, setNovaSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/resetarSenha', { token, novaSenha });
      alert('Senha alterada com sucesso! Faça login.');
      navigate('/login');
    } catch (err) {
      setError('Token inválido ou expirado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-sm" style={{ width: '400px', borderTop: '5px solid var(--cor-secundaria)' }}>
        <div className="card-body p-4">
          <h3 className="text-center mb-4">Nova Senha</h3>
          
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nova Senha</label>
              <input 
                type="password" 
                className="form-control" 
                value={novaSenha}
                onChange={e => setNovaSenha(e.target.value)}
                required
                minLength={3}
              />
            </div>
            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Salvando...' : 'Redefinir Senha'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}