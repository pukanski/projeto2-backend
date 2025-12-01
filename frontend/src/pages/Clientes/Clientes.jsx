import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Modal, Button, Form, Table, Alert, Spinner, InputGroup, FormControl } from 'react-bootstrap';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  
  const [formData, setFormData] = useState({
    id: '',
    nome: '',
    email: '',
    cpf: '',
    telefone: ''
  });

  const [formError, setFormError] = useState(null);

  
  const maskCPF = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2') 
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const maskPhone = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/clientes');
      setClientes(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar clientes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError(null);
    
    try {
      if (modalMode === 'create') {
        await api.post('/clientes', formData);
        alert('Cliente cadastrado com sucesso!');
      } else {
        await api.put(`/clientes/${formData.id}`, formData);
        alert('Cliente atualizado com sucesso!');
      }
      
      handleCloseModal();
      fetchClientes();
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
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return;

    try {
      await api.delete(`/clientes/${id}`);
      fetchClientes();
    } catch (err) {
      const msg = err.response?.data?.message || 'Erro ao excluir cliente.';
      alert(msg);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormError(null);
    setFormData({ id: '', nome: '', email: '', cpf: '', telefone: '' });
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({ id: '', nome: '', email: '', cpf: '', telefone: '' });
    setShowModal(true);
  };

  const openEditModal = (cliente) => {
    setModalMode('edit');
    setFormData(cliente);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'cpf') newValue = maskCPF(value);
    if (name === 'telefone') newValue = maskPhone(value);

    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const filteredClientes = clientes.filter(cliente => {
    const term = searchTerm.toLowerCase();
    return (
      cliente.nome.toLowerCase().includes(term) ||
      cliente.cpf.includes(term) ||
      cliente.email.toLowerCase().includes(term)
    );
  });

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gerenciamento de Clientes</h2>
        <Button variant="primary" onClick={openCreateModal}>
          + Novo Cliente
        </Button>
      </div>

      {/* Barra de Busca */}
      <div className="mb-3">
        <InputGroup>
          <InputGroup.Text>🔍</InputGroup.Text>
          <FormControl
            placeholder="Buscar por nome, CPF ou email..."
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
                <th>Nome</th>
                <th>Email</th>
                <th>CPF</th>
                <th>Telefone</th>
                <th className="text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredClientes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    {searchTerm ? 'Nenhum cliente encontrado para a busca.' : 'Nenhum cliente cadastrado.'}
                  </td>
                </tr>
              ) : (
                filteredClientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{cliente.nome}</td>
                    <td>{cliente.email}</td>
                    <td>{cliente.cpf}</td>
                    <td>{cliente.telefone || '-'}</td>
                    <td className="text-end">
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => openEditModal(cliente)}
                      >
                        Editar
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDelete(cliente.id)}
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

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{modalMode === 'create' ? 'Novo Cliente' : 'Editar Cliente'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            {formError && <Alert variant="danger">{formError}</Alert>}

            <Form.Group className="mb-3">
              <Form.Label>Nome Completo</Form.Label>
              <Form.Control 
                type="text" 
                name="nome"
                value={formData.nome} 
                onChange={handleChange}
                required 
                minLength={3}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>E-mail</Form.Label>
              <Form.Control 
                type="email" 
                name="email"
                value={formData.email} 
                onChange={handleChange}
                required 
              />
            </Form.Group>

            <div className="row">
                <div className="col-md-6">
                    <Form.Group className="mb-3">
                    <Form.Label>CPF</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="cpf"
                        value={formData.cpf} 
                        onChange={handleChange}
                        required 
                        placeholder="000.000.000-00"
                        maxLength={14}
                    />
                    </Form.Group>
                </div>
                <div className="col-md-6">
                    <Form.Group className="mb-3">
                    <Form.Label>Telefone</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="telefone"
                        value={formData.telefone} 
                        onChange={handleChange}
                        placeholder="(00) 00000-0000"
                        maxLength={15}
                    />
                    </Form.Group>
                </div>
            </div>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Salvar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}