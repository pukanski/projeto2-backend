import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Modal, Button, Form, Table, Alert, Spinner, Badge, InputGroup, FormControl } from 'react-bootstrap';

export default function Reservas() {
  const [reservas, setReservas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [quartos, setQuartos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado da Busca
  const [searchTerm, setSearchTerm] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [formError, setFormError] = useState(null);
  const [formData, setFormData] = useState({
    id: '', cliente_id: '', quarto_id: '', 
    data_checkin: '', data_checkout: '', status: 'Pendente'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resReservas, resClientes, resQuartos] = await Promise.all([
        api.get('/reservas'),
        api.get('/clientes'),
        api.get('/quartos')
      ]);
      setReservas(resReservas.data);
      setClientes(resClientes.data);
      setQuartos(resQuartos.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar dados. Verifique a conexão.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError(null);
    const payload = { ...formData, cliente_id: parseInt(formData.cliente_id), quarto_id: parseInt(formData.quarto_id) };

    try {
      if (modalMode === 'create') {
        await api.post('/reservas', payload);
        alert('Reserva criada com sucesso!');
      } else {
        await api.put(`/reservas/${formData.id}`, payload);
        alert('Reserva atualizada com sucesso!');
      }
      handleCloseModal();
      fetchData();
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
    if (!window.confirm('Tem certeza? Isso liberará o quarto para estas datas.')) return;
    try {
      await api.delete(`/reservas/${id}`);
      fetchData();
    } catch (err) {
      alert('Erro ao excluir reserva.');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormError(null);
    setFormData({ id: '', cliente_id: '', quarto_id: '', data_checkin: '', data_checkout: '', status: 'Pendente' });
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({ id: '', cliente_id: '', quarto_id: '', data_checkin: '', data_checkout: '', status: 'Pendente' });
    setShowModal(true);
  };

  const openEditModal = (reserva) => {
    setModalMode('edit');
    const checkin = reserva.data_checkin ? reserva.data_checkin.split('T')[0] : '';
    const checkout = reserva.data_checkout ? reserva.data_checkout.split('T')[0] : '';
    setFormData({
        id: reserva.id,
        cliente_id: reserva.cliente_id,
        quarto_id: reserva.quarto_id,
        data_checkin: checkin,
        data_checkout: checkout,
        status: reserva.status
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getStatusBadge = (status) => {
    switch(status) {
        case 'Confirmada': return <Badge bg="success">Confirmada</Badge>;
        case 'Cancelada': return <Badge bg="danger">Cancelada</Badge>;
        default: return <Badge bg="warning" text="dark">Pendente</Badge>;
    }
  };

  const formatDateDisplay = (isoDate) => {
      if (!isoDate) return '-';
      const datePart = isoDate.split('T')[0];
      const [year, month, day] = datePart.split('-');
      return `${day}/${month}/${year}`;
  };

  // --- LÓGICA DE FILTRO INTELIGENTE ---
  const filteredReservas = reservas.filter(reserva => {
    const term = searchTerm.toLowerCase();
    
    // Busca segura (verifica se cliente/quarto existem antes de acessar nome/numero)
    const nomeCliente = reserva.cliente ? reserva.cliente.nome.toLowerCase() : '';
    const numeroQuarto = reserva.quarto ? reserva.quarto.numero.toLowerCase() : '';
    const status = reserva.status.toLowerCase();

    return (
      nomeCliente.includes(term) ||
      numeroQuarto.includes(term) ||
      status.includes(term)
    );
  });

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gerenciamento de Reservas</h2>
        <Button variant="primary" onClick={openCreateModal}>
          + Nova Reserva
        </Button>
      </div>

      {/* Barra de Busca */}
      <div className="mb-3">
        <InputGroup>
          <InputGroup.Text>🔍</InputGroup.Text>
          <FormControl
            placeholder="Buscar por nome do cliente, número do quarto ou status..."
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
                <th>ID</th>
                <th>Cliente</th>
                <th>Quarto</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Valor Total</th>
                <th>Status</th>
                <th className="text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservas.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    {searchTerm ? 'Nenhuma reserva encontrada para a busca.' : 'Nenhuma reserva cadastrada.'}
                  </td>
                </tr>
              ) : (
                filteredReservas.map((reserva) => (
                  <tr key={reserva.id}>
                    <td>{reserva.id}</td>
                    <td>{reserva.cliente ? reserva.cliente.nome : 'Cliente Removido'}</td>
                    <td>Quarto {reserva.quarto ? reserva.quarto.numero : '?'}</td>
                    <td>{formatDateDisplay(reserva.data_checkin)}</td>
                    <td>{formatDateDisplay(reserva.data_checkout)}</td>
                    <td><strong>R$ {reserva.valor_total ? parseFloat(reserva.valor_total).toFixed(2) : '0.00'}</strong></td>
                    <td>{getStatusBadge(reserva.status)}</td>
                    <td className="text-end">
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => openEditModal(reserva)}>Editar</Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(reserva.id)}>Cancelar</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      )}

      {/* Modal igual ao anterior */}
      <Modal show={showModal} onHide={handleCloseModal} backdrop="static" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{modalMode === 'create' ? 'Nova Reserva' : 'Editar Reserva'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            {formError && <Alert variant="danger">{formError}</Alert>}
            <div className="row">
                <div className="col-md-6">
                    <Form.Group className="mb-3">
                    <Form.Label>Cliente</Form.Label>
                    <Form.Select name="cliente_id" value={formData.cliente_id} onChange={handleChange} required>
                        <option value="">Selecione um Cliente...</option>
                        {clientes.map(c => ( <option key={c.id} value={c.id}>{c.nome} (CPF: {c.cpf})</option> ))}
                    </Form.Select>
                    </Form.Group>
                </div>
                <div className="col-md-6">
                    <Form.Group className="mb-3">
                    <Form.Label>Quarto</Form.Label>
                    <Form.Select name="quarto_id" value={formData.quarto_id} onChange={handleChange} required>
                        <option value="">Selecione um Quarto...</option>
                        {quartos.map(q => ( <option key={q.id} value={q.id}>Quarto {q.numero} ({q.tipo}) - R$ {q.preco_diaria}/dia</option> ))}
                    </Form.Select>
                    </Form.Group>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <Form.Group className="mb-3">
                        <Form.Label>Data Check-in</Form.Label>
                        <Form.Control type="date" name="data_checkin" value={formData.data_checkin} onChange={handleChange} required />
                    </Form.Group>
                </div>
                <div className="col-md-6">
                    <Form.Group className="mb-3">
                        <Form.Label>Data Check-out</Form.Label>
                        <Form.Control type="date" name="data_checkout" value={formData.data_checkout} onChange={handleChange} required />
                    </Form.Group>
                </div>
            </div>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select name="status" value={formData.status} onChange={handleChange}>
                <option value="Pendente">Pendente</option>
                <option value="Confirmada">Confirmada</option>
                <option value="Cancelada">Cancelada</option>
              </Form.Select>
            </Form.Group>
            <Alert variant="info" className="mt-3"><small>ℹ️ O valor total será calculado automaticamente.</small></Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
            <Button variant="primary" type="submit">Salvar Reserva</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}