const { Cliente } = require('../models');

exports.create = async (req, res) => {
    try {
        const { nome, email, telefone, cpf } = req.body;
        const novoCliente = await Cliente.create({ nome, email, telefone, cpf });
        res.status(201).json(novoCliente);

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Conflito: Email ou CPF já cadastrado.' });
        }
        console.error('Erro ao criar cliente:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, telefone, cpf } = req.body;

        const [updated] = await Cliente.update({ nome, email, telefone, cpf }, {
            where: { id: id }
        });

        if (updated) {
            const updatedCliente = await Cliente.findByPk(id);
            return res.status(200).json(updatedCliente);
        }
        
        return res.status(404).json({ message: 'Cliente não encontrado.' });

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Conflito: Email ou CPF já cadastrado.' });
        }
        console.error('Erro ao atualizar cliente:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

exports.getAll = async (req, res) => {
    try {
        const clientes = await Cliente.findAll();
        res.status(200).json(clientes);
    } catch (error) {
        console.error('Erro ao listar clientes:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const cliente = await Cliente.findByPk(id);
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente não encontrado.' });
        }
        res.status(200).json(cliente);
    } catch (error) {
        console.error('Erro ao buscar cliente:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deleted = await Cliente.destroy({
            where: { id: id }
        });

        if (deleted) {
            return res.status(204).send();
        }
        
        return res.status(404).json({ message: 'Cliente não encontrado.' });

    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(409).json({ message: 'Conflito: Não é possível deletar um cliente que possui reservas ativas.' });
        }
        console.error('Erro ao deletar cliente:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};