const { Reserva, Quarto, Cliente } = require('../models');


const calcularValorTotal = async (quarto_id, data_checkin, data_checkout) => {
    const quarto = await Quarto.findByPk(quarto_id);
    if (!quarto) {
        throw new Error('Quarto não encontrado');
    }

    const checkin = new Date(data_checkin);
    const checkout = new Date(data_checkout);

    if (checkout <= checkin) {
        throw new Error('Data de checkout deve ser posterior à data de checkin');
    }

    const tempoMs = Math.abs(checkout - checkin);
    const Dias = Math.ceil(tempoMs / (1000 * 60 * 60 * 24)); 

    const valorTotal = Dias * quarto.preco_diaria;
    
    return valorTotal;
};

exports.create = async (req, res) => {
    try {
        const { cliente_id, quarto_id, data_checkin, data_checkout, status } = req.body;

        if (!cliente_id || !quarto_id || !data_checkin || !data_checkout) {
            return res.status(400).json({ message: 'Cliente, Quarto e Datas são obrigatórios.' });
        }

        const valorTotal = await calcularValorTotal(quarto_id, data_checkin, data_checkout);

        const novaReserva = await Reserva.create({
            cliente_id,
            quarto_id,
            data_checkin,
            data_checkout,
            valor_total: valorTotal,
            status: status || 'Pendente'
        });

        res.status(201).json(novaReserva);

    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(404).json({ message: 'Cliente ou Quarto não encontrado.' });
        }
        if (error.message.includes('Quarto não encontrado') || error.message.includes('Data de checkout')) {
            return res.status(400).json({ message: error.message });
        }
        console.error('Erro ao criar reserva:', error);
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

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { cliente_id, quarto_id, data_checkin, data_checkout, status } = req.body;

        const reserva = await Reserva.findByPk(id);
        if (!reserva) {
            return res.status(404).json({ message: 'Reserva não encontrada.' });
        }

        const valorTotal = await calcularValorTotal(
            quarto_id || reserva.quarto_id,
            data_checkin || reserva.data_checkin,
            data_checkout || reserva.data_checkout
        );

        reserva.cliente_id = cliente_id || reserva.cliente_id;
        reserva.quarto_id = quarto_id || reserva.quarto_id;
        reserva.data_checkin = data_checkin || reserva.data_checkin;
        reserva.data_checkout = data_checkout || reserva.data_checkout;
        reserva.status = status || reserva.status;
        reserva.valorTotal = valorTotal;

        await reserva.save();

        res.status(200).json(reserva);

    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(404).json({ message: 'Cliente ou Quarto não encontrado.' });
        }
        if (error.message.includes('Quarto não encontrado') || error.message.includes('Data de checkout')) {
            return res.status(400).json({ message: error.message });
        }
        console.error('Erro ao atualizar reserva:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const reserva = await Reserva.findByPk(id);

        if (!reserva) {
            return res.status(404).json({ message: 'Reserva não encontrada.' });
        }

        await reserva.destroy();

        res.status(204).send(); 

    } catch (error) {
        console.error('Erro ao deletar reserva:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};