const { Reserva, Quarto, Cliente } = require('../models');
const { Op } = require('sequelize');

const calcularValorTotal = (preco_diaria, data_checkin, data_checkout) => {
    const checkin = new Date(data_checkin);
    const checkout = new Date(data_checkout);
    if (checkout <= checkin) {
        throw new Error('Data de checkout deve ser posterior à data de checkin');
    }
    const diffTime = Math.abs(checkout - checkin);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays * preco_diaria;
};

exports.create = async (req, res) => {
    try {
        const { cliente_id, quarto_id, data_checkin, data_checkout, status } = req.body;

        const hoje = new Date();
        const dataCheckinFormatada = new Date(data_checkin);
        hoje.setHours(0, 0, 0, 0); 
        
        if (dataCheckinFormatada < hoje) {
            return res.status(400).json({ message: 'Não é possível criar reservas para datas passadas.' });
        }

        const quarto = await Quarto.findByPk(quarto_id);
        if (!quarto) {
            return res.status(404).json({ message: 'Quarto não encontrado.' });
        }
        if (quarto.status !== 'Disponivel') {
            return res.status(409).json({ message: 'Conflito: Quarto não está disponível.' });
        }

        const conflito = await Reserva.findOne({
            where: {
                quarto_id: quarto_id,
                [Op.or]: [
                    {
                        data_checkin: { [Op.lte]: data_checkout },
                        data_checkout: { [Op.gte]: data_checkin }
                    }
                ]
            }
        });

        if (conflito) {
            return res.status(409).json({ 
                message: 'Conflito: O quarto já está reservado para este período.',
                reserva_conflitante: conflito
            });
        }

        const valor_total = calcularValorTotal(quarto.preco_diaria, data_checkin, data_checkout);

        const novaReserva = await Reserva.create({
            cliente_id, quarto_id, data_checkin, data_checkout,
            valor_total: valor_total,
            status: status
        });

        res.status(201).json(novaReserva);

    } catch (error) {
        if (error.message.includes('Data de checkout')) {
            return res.status(400).json({ message: error.message });
        }
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(404).json({ message: 'Cliente não encontrado.' });
        }
        console.error('Erro ao criar reserva:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { cliente_id, quarto_id, data_checkin, data_checkout, status } = req.body;

        const reserva = await Reserva.findByPk(id);
        if (!reserva) {
            return res.status(404).json({ message: 'Reserva não encontrada.' });
        }

        const dataCheckinParaUsar = data_checkin || reserva.data_checkin;
        const dataCheckoutParaUsar = data_checkout || reserva.data_checkout;
        
        const hoje = new Date();
        const dataCheckinFormatada = new Date(dataCheckinParaUsar);
        hoje.setHours(0, 0, 0, 0); 

        if (dataCheckinFormatada < hoje) {
            return res.status(400).json({ message: 'Não é possível mover reservas para datas passadas.' });
        }

        const quartoIdParaUsar = quarto_id || reserva.quarto_id;
        const quarto = await Quarto.findByPk(quartoIdParaUsar);
        if (!quarto) {
            return res.status(404).json({ message: 'Quarto associado não encontrado.' });
        }

        if (quarto_id && (quarto_id !== reserva.quarto_id) && (quarto.status !== 'Disponivel')) {
            return res.status(409).json({ 
                message: `Conflito: Não é possível mover a reserva. O Quarto ${quarto.numero} não está disponível.` 
            });
        }

        const conflito = await Reserva.findOne({
            where: {
                id: { [Op.ne]: id }, 
                quarto_id: quartoIdParaUsar,
                [Op.or]: [
                    {
                        data_checkin: { [Op.lte]: dataCheckoutParaUsar },
                        data_checkout: { [Op.gte]: dataCheckinParaUsar }
                    }
                ]
            }
        });

        if (conflito) {
            return res.status(409).json({ 
                message: 'Conflito: O quarto já está reservado para este período.',
                reserva_conflitante: conflito
            });
        }

        const valor_total = calcularValorTotal(
            quarto.preco_diaria,
            dataCheckinParaUsar,
            dataCheckoutParaUsar
        );

        await reserva.update({
            cliente_id: cliente_id || reserva.cliente_id,
            quarto_id: quartoIdParaUsar,
            data_checkin: dataCheckinParaUsar,
            data_checkout: dataCheckoutParaUsar,
            status: status || reserva.status,
            valor_total: valor_total
        });

        res.status(200).json(reserva);

    } catch (error) {
        if (error.message.includes('Data de checkout')) {
            return res.status(400).json({ message: error.message });
        }
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(404).json({ message: 'Cliente não encontrado (na atualização).' });
        }
        console.error('Erro ao atualizar reserva:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

exports.getAll = async (req, res) => {
    try {
        const reservas = await Reserva.findAll({
            include: [
                { model: Cliente, attributes: ['id', 'nome', 'email'] },
                { model: Quarto, attributes: ['id', 'numero', 'tipo'] }
            ]
        });
        res.status(200).json(reservas);
    } catch (error) {
        console.error('Erro ao listar reservas:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const reserva = await Reserva.findByPk(id, {
            include: [
                { model: Cliente, attributes: ['id', 'nome', 'email'] },
                { model: Quarto, attributes: ['id', 'numero', 'tipo'] }
            ]
        });

        if (!reserva) {
            return res.status(404).json({ message: 'Reserva não encontrada.' });
        }

        res.status(200).json(reserva);

    } catch (error) {
        console.error('Erro ao buscar reserva:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Reserva.destroy({
            where: { id: id }
        });
        if (deleted) {
            return res.status(204).send();
        }
        return res.status(404).json({ message: 'Reserva não encontrada.' });
    } catch (error) {
        console.error('Erro ao deletar reserva:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};