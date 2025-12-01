module.exports = (sequelize, Sequelize) => {
    const Reserva = sequelize.define('reserva', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        cliente_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'clientes',
                key: 'id'
            }
        },
        quarto_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'quartos',
                key: 'id'
            }
        },
        data_checkin: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        data_checkout: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        valor_total: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM('Pendente', 'Confirmada', 'Cancelada'),
            defaultValue: 'Pendente',
            allowNull: false,
        }
    });
    return Reserva;
}