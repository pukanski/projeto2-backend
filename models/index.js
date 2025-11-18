'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../config/configSequelize');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Usuario = require('./modelUsuario.js')(sequelize, Sequelize);
db.Cliente = require('./modelCliente.js')(sequelize, Sequelize);
db.Quarto = require('./modelQuarto.js')(sequelize, Sequelize);
db.Reserva = require('./modelReserva.js')(sequelize, Sequelize);

db.Cliente.hasMany(db.Reserva, { foreignKey: 'cliente_id', onDelete: 'RESTRICT'});
db.Reserva.belongsTo(db.Cliente, { foreignKey: 'cliente_id' });

db.Quarto.hasMany(db.Reserva, { foreignKey: 'quarto_id', onDelete: 'RESTRICT' });
db.Reserva.belongsTo(db.Quarto, { foreignKey: 'quarto_id' });

module.exports = db;