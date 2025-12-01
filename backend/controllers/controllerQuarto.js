const { Quarto } = require('../models');

exports.create = async (req, res) => {
    try {
        const { numero, tipo, preco_diaria, status } = req.body;
        const novoQuarto = await Quarto.create({ numero, tipo, preco_diaria, status });
        res.status(201).json(novoQuarto);

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Conflito: O número do quarto já existe.' });
        }
        console.error('Erro ao criar quarto:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { numero, tipo, preco_diaria, status } = req.body;

        const [updated] = await Quarto.update({ numero, tipo, preco_diaria, status }, {
            where: { id: id }
        });

        if (updated) {
            const updatedQuarto = await Quarto.findByPk(id);
            return res.status(200).json(updatedQuarto);
        }
        
        return res.status(404).json({ message: 'Quarto não encontrado.' });

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Conflito: O número do quarto já existe.' });
        }
        console.error('Erro ao atualizar quarto:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

exports.getAll = async (req, res) => {
    try {
        const quartos = await Quarto.findAll();
        res.status(200).json(quartos);
    } catch (error) {
        console.error('Erro ao listar quartos:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const quarto = await Quarto.findByPk(id);

        if (!quarto) {
            return res.status(404).json({ message: 'Quarto não encontrado.' });
        }

        res.status(200).json(quarto);

    } catch (error) {
        console.error('Erro ao buscar quarto:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Quarto.destroy({
            where: { id: id }
        });

        if (deleted) {
            return res.status(204).send();
        }

        return res.status(404).json({ message: 'Quarto não encontrado.' });

    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(409).json({ message: 'Conflito: Não é possível deletar um quarto que possui reservas ativas.' });
        }
        console.error('Erro ao deletar quarto:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};