module.exports = (sequelize, Sequelize) => {
    const Quarto = sequelize.define('quarto', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        numero: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        tipo: {
            type: Sequelize.ENUM('Standard', 'Deluxe', 'Suíte'),
            defaultValue: 'Standard',
            allowNull: false,
        },
        preco_diaria: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM('Disponivel', 'Ocupado', 'Manutencao'),
            defaultValue: 'Disponivel',
            allowNull: false,
        }
    });
    return Quarto;
}