const bcrypt = require('bcrypt');

module.exports = (sequelize, Sequelize) => {
    const Usuario = sequelize.define('usuario', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        nome: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        senha: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

    const hashPassword = async (usuario) => {
            const salt = await bcrypt.genSalt(10);
            usuario.senha = await bcrypt.hash(usuario.senha, salt);
        };
    
        Usuario.beforeCreate(hashPassword);
        
        Usuario.beforeUpdate(async (usuario) => {
            if (usuario.changed('senha')) {
                await hashPassword(usuario);
            }
        });
        
        Usuario.prototype.validarSenha = async function (senhaFormulario) {
            return await bcrypt.compare(senhaFormulario, this.senha);
        };
    
        return Usuario;
};

