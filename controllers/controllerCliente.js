const { Cliente } = require('../models');

exports.create = async (req, res) => {
    try {
        const { nome, email, telefone, cpf } = req.body;

        if (!nome || !email || !cpf) {
            return res.status(400).json({ message: 'Nome, email e CPF são obrigatórios.' });
        }

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

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, telefone, cpf } = req.body;

        const cliente = await Cliente.findByPk(id);
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente não encontrado.' });
        }

        cliente.nome = nome;
        cliente.email = email;
        cliente.telefone = telefone;
        cliente.cpf = cpf;

        await cliente.save();

        res.status(200).json(cliente);

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Conflito: Email ou CPF já cadastrado.' });
        }
        console.error('Erro ao atualizar cliente:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const cliente = await Cliente.findByPk(id);

        if (!cliente) {
            return res.status(44).json({ message: 'Cliente não encontrado.' });
        }

        await cliente.destroy();

        res.status(204).send(); 

    } catch (error) {
        console.error('Erro ao deletar cliente:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};