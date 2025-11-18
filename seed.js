const db = require('./models');

/**
 * - Limpa o banco (force: true)
 * - Popula dados de teste para Usuários, Quartos, Clientes e Reservas
 * * Rode com: node seed.js
 */
const seedDatabase = async () => {
    try {
        console.log('Iniciando sincronização e limpeza do banco (force: true)...');
        await db.sequelize.sync({ force: true });
        console.log('Banco limpo e sincronizado.');

        const admin = await db.Usuario.create({
            nome: 'Admin',
            email: 'admin@hotel.com',
            senha: '123'
        });
        console.log(`Usuário Admin criado: ${admin.email} (senha: 123)`);

        const quartos = await db.Quarto.bulkCreate([
            { numero: '101', tipo: 'Standard', preco_diaria: 150.00, status: 'Disponivel' },
            { numero: '202', tipo: 'Deluxe', preco_diaria: 250.50, status: 'Disponivel' },
            { numero: '303', tipo: 'Suíte', preco_diaria: 400.00, status: 'Manutencao' }
        ]);
        console.log(`Criados ${quartos.length} quartos.`);

        const clientes = await db.Cliente.bulkCreate([
            { nome: 'Ana Silva', email: 'ana.silva@teste.com', cpf: '111.111.111-11', telefone: '9999-0001' },
            { nome: 'Bruno Costa', email: 'bruno.costa@teste.com', cpf: '222.222.222-22', telefone: '9999-0002' }
        ]);
        console.log(`Criados ${clientes.length} clientes.`);

        const cliente1_id = clientes[0].id;
        const cliente2_id = clientes[1].id;
        const quarto1_id = quartos[0].id; 
        const quarto2_id = quartos[1].id; 

        const reserva1 = await db.Reserva.create({
            cliente_id: cliente1_id,
            quarto_id: quarto1_id,
            data_checkin: '2025-11-20T14:00:00Z',
            data_checkout: '2025-11-22T12:00:00Z',
            valor_total: 300.00,
            status: 'Confirmada'
        });

        const reserva2 = await db.Reserva.create({
            cliente_id: cliente2_id,
            quarto_id: quarto2_id,
            data_checkin: '2025-11-25T14:00:00Z',
            data_checkout: '2025-11-28T12:00:00Z',
            valor_total: 751.50,
            status: 'Pendente'
        });
        
        console.log('Reservas de teste criadas.');
        console.log('\n--- Base de dados populada com sucesso! ---');

    } catch (error) {
        console.error('Erro ao popular o banco:', error);
    } finally {
        await db.sequelize.close();
        console.log('Conexão com o banco fechada.');
    }
};

seedDatabase();