// Importa o 'db' (models/index.js)
const db = require('./models');

/**
 * Script de Semente (Seed) - Expandido
 * - Limpa o banco (force: true)
 * - 1 Usuário Admin
 * - 6 Clientes
 * - 10 Quartos
 * - 8 Reservas
 */
const seedDatabase = async () => {
    try {
        console.log('--- Iniciando Seed ---');
        console.log('Limpando banco de dados...');
        await db.sequelize.sync({ force: true });
        console.log('Banco limpo.');

        // --- 1. Usuário Admin ---
        console.log('Criando Usuário Admin...');
        const admin = await db.Usuario.create({
            nome: 'Administrador Hotel',
            email: 'admin@hotel.com',
            senha: '123' // O hook beforeCreate fará o hash
        });

        // --- 2. Clientes (6) ---
        console.log('Criando 6 Clientes...');
        const clientes = await db.Cliente.bulkCreate([
            { nome: 'Ana Silva', email: 'ana@teste.com', cpf: '111.111.111-11', telefone: '(11) 91111-1111' },
            { nome: 'Bruno Costa', email: 'bruno@teste.com', cpf: '222.222.222-22', telefone: '(22) 92222-2222' },
            { nome: 'Carla Dias', email: 'carla@teste.com', cpf: '333.333.333-33', telefone: '(33) 93333-3333' },
            { nome: 'Daniel Rocha', email: 'daniel@teste.com', cpf: '444.444.444-44', telefone: '(44) 94444-4444' },
            { nome: 'Eduardo Lima', email: 'eduardo@teste.com', cpf: '555.555.555-55', telefone: '(55) 95555-5555' },
            { nome: 'Fernanda Souza', email: 'fernanda@teste.com', cpf: '666.666.666-66', telefone: '(66) 96666-6666' }
        ]);

        // --- 3. Quartos (10) ---
        console.log('Criando 10 Quartos...');
        const quartos = await db.Quarto.bulkCreate([
            // Standard (R$ 150.00)
            { numero: '101', tipo: 'Standard', preco_diaria: 150.00, status: 'Disponivel' },
            { numero: '102', tipo: 'Standard', preco_diaria: 150.00, status: 'Ocupado' },
            { numero: '103', tipo: 'Standard', preco_diaria: 150.00, status: 'Manutencao' },
            { numero: '104', tipo: 'Standard', preco_diaria: 150.00, status: 'Disponivel' },
            
            // Deluxe (R$ 250.00)
            { numero: '201', tipo: 'Deluxe', preco_diaria: 250.00, status: 'Disponivel' },
            { numero: '202', tipo: 'Deluxe', preco_diaria: 250.00, status: 'Ocupado' },
            { numero: '203', tipo: 'Deluxe', preco_diaria: 250.00, status: 'Disponivel' },
            
            // Suíte (R$ 400.00)
            { numero: '301', tipo: 'Suíte', preco_diaria: 400.00, status: 'Disponivel' },
            { numero: '302', tipo: 'Suíte', preco_diaria: 400.00, status: 'Disponivel' },
            { numero: '303', tipo: 'Suíte', preco_diaria: 400.00, status: 'Manutencao' }
        ]);

        // --- 4. Reservas (8) ---
        // Observação: IDs são gerados sequencialmente (1 a 6 para clientes, 1 a 10 para quartos)
        console.log('Criando 8 Reservas...');
        
        const reservasData = [
            // Reserva 1: Ana (1) no Quarto 101 (Standard 150) por 3 dias
            {
                cliente_id: 1, quarto_id: 1,
                data_checkin: '2025-12-01', data_checkout: '2025-12-04',
                valor_total: 450.00, status: 'Confirmada'
            },
            // Reserva 2: Bruno (2) no Quarto 201 (Deluxe 250) por 2 dias
            {
                cliente_id: 2, quarto_id: 5,
                data_checkin: '2025-12-05', data_checkout: '2025-12-07',
                valor_total: 500.00, status: 'Pendente'
            },
            // Reserva 3: Carla (3) no Quarto 301 (Suíte 400) por 5 dias
            {
                cliente_id: 3, quarto_id: 8,
                data_checkin: '2025-12-10', data_checkout: '2025-12-15',
                valor_total: 2000.00, status: 'Confirmada'
            },
            // Reserva 4: Daniel (4) no Quarto 104 (Standard 150) por 1 dia
            {
                cliente_id: 4, quarto_id: 4,
                data_checkin: '2025-12-20', data_checkout: '2025-12-21',
                valor_total: 150.00, status: 'Cancelada'
            },
            // Reserva 5: Eduardo (5) no Quarto 203 (Deluxe 250) por 4 dias
            {
                cliente_id: 5, quarto_id: 7,
                data_checkin: '2025-12-23', data_checkout: '2025-12-27',
                valor_total: 1000.00, status: 'Confirmada'
            },
            // Reserva 6: Fernanda (6) no Quarto 302 (Suíte 400) por 2 dias
            {
                cliente_id: 6, quarto_id: 9,
                data_checkin: '2025-12-30', data_checkout: '2026-01-01',
                valor_total: 800.00, status: 'Pendente'
            },
            // Reserva 7: Ana (1) retorna no Quarto 201 (Deluxe 250) por 3 dias
            {
                cliente_id: 1, quarto_id: 5,
                data_checkin: '2026-01-10', data_checkout: '2026-01-13',
                valor_total: 750.00, status: 'Confirmada'
            },
            // Reserva 8: Bruno (2) no Quarto 104 (Standard 150) por 7 dias
            {
                cliente_id: 2, quarto_id: 4,
                data_checkin: '2026-02-01', data_checkout: '2026-02-08',
                valor_total: 1050.00, status: 'Pendente'
            }
        ];

        await db.Reserva.bulkCreate(reservasData);

        console.log('--- Seed Completo com Sucesso! ---');
        console.log(`Admin: ${admin.email} / senha: 123`);

    } catch (error) {
        console.error('Erro fatal ao rodar seed:', error);
    } finally {
        await db.sequelize.close();
        console.log('Conexão fechada.');
    }
};

seedDatabase();