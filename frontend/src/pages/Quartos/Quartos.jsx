import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Modal, Button, Form, Table, Alert, Spinner, Badge, InputGroup, FormControl } from 'react-bootstrap';

export default function Quartos() {
  const [quartos, setQuartos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado da Busca
  const [searchTerm, setSearchTerm] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [formData, setFormData] = useState({
    id: '',
    numero: '',
    tipo: 'Standard',
    preco_diaria: '',
    status: 'Disponivel'
  });
  const [formError, setFormError] = useState(null);

  const fetchQuartos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/quartos');
      setQuartos(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar quartos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuartos();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError(null);
    const payload = { ...formData, preco_diaria: parseFloat(formData.preco_diaria) };

    try {
      if (modalMode === 'create') {
        await api.post('/quartos', payload);
        alert('Quarto cadastrado com sucesso!');
      } else {
        await api.put(`/quartos/${formData.id}`, payload);
        alert('Quarto atualizado com sucesso!');
      }
      handleCloseModal();
      fetchQuartos();
    } catch (err) {
      if (err.response && err.response.data) {
        if (err.response.data.errors) {
          const msg = err.response.data.errors.map(e => e.msg).join(' | ');
          setFormError(msg);
        } else {
          setFormError(err.response.data.message || 'Erro ao salvar.');
        }
      } else {
        setFormError('Erro de rede.');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este quarto?')) return;
    try {
      await api.delete(`/quartos/${id}`);
      fetchQuartos();
    } catch (err) {
      const msg = err.response?.data?.message || 'Erro ao excluir quarto.';
      alert(msg);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormError(null);
    setFormData({ id: '', numero: '', tipo: 'Standard', preco_diaria: '', status: 'Disponivel' });
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({ id: '', numero: '', tipo: 'Standard', preco_diaria: '', status: 'Disponivel' });
    setShowModal(true);
  };

  const openEditModal = (quarto) => {
    setModalMode('edit');
    setFormData(quarto);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getStatusBadge = (status) => {
      switch(status) {
          case 'Disponivel': return <Badge bg="success">Disponível</Badge>;
          case 'Ocupado': return <Badge bg="danger">Ocupado</Badge>;
          case 'Manutencao': return <Badge bg="warning" text="dark">Manutenção</Badge>;
          default: return <Badge bg="secondary">{status}</Badge>;
      }
  };

  // --- LÓGICA DE FILTRO ---
  const filteredQuartos = quartos.filter(quarto => {
    const term = searchTerm.toLowerCase();
    return (
      quarto.numero.toLowerCase().includes(term) ||
      quarto.tipo.toLowerCase().includes(term) ||
      quarto.status.toLowerCase().includes(term)
    );
  });

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gerenciamento de Quartos</h2>
        <Button variant="primary" onClick={openCreateModal}>
          + Novo Quarto
        </Button>
      </div>

      {/* Barra de Busca */}
      <div className="mb-3">
        <InputGroup>
          <InputGroup.Text id="search-icon">🔍</InputGroup.Text>
          <FormControl
            placeholder="Buscar por número, tipo ou status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center"><Spinner animation="border" /></div>
      ) : (
        <div className="card shadow-sm">
          <Table striped hover responsive className="mb-0">
            <thead className="table-dark">
              <tr>
                <th>Número</th>
                <th>Tipo</th>
                <th>Preço Diária</th>
                <th>Status</th>
                <th className="text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuartos.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    {searchTerm ? 'Nenhum quarto encontrado para a busca.' : 'Nenhum quarto cadastrado.'}
                  </td>
                </tr>
              ) : (
                filteredQuartos.map((quarto) => (
                  <tr key={quarto.id}>
                    <td><strong>{quarto.numero}</strong></td>
                    <td>{quarto.tipo}</td>
                    <td>R$ {parseFloat(quarto.preco_diaria).toFixed(2)}</td>
                    <td>{getStatusBadge(quarto.status)}</td>
                    <td className="text-end">
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => openEditModal(quarto)}
                      >
                        Editar
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDelete(quarto.id)}
                      >
                        Excluir
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      )}

      {/* Modal permanece igual */}
      <Modal show={showModal} onHide={handleCloseModal} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{modalMode === 'create' ? 'Novo Quarto' : 'Editar Quarto'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            {formError && <Alert variant="danger">{formError}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Número do Quarto</Form.Label>
              <Form.Control type="number" min="1" name="numero" value={formData.numero} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Select name="tipo" value={formData.tipo} onChange={handleChange}>
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suíte">Suíte</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Preço da Diária (R$)</Form.Label>
              <Form.Control type="number" step="0.01" name="preco_diaria" value={formData.preco_diaria} onChange={handleChange} required min="0" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status Atual</Form.Label>
              <Form.Select name="status" value={formData.status} onChange={handleChange}>
                <option value="Disponivel">Disponível</option>
                <option value="Ocupado">Ocupado</option>
                <option value="Manutencao">Manutenção</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
            <Button variant="primary" type="submit">Salvar</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}