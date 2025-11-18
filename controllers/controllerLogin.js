const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { Usuario } = require('../models'); 
const JWT_SECRET = 'segredo';

exports.postLogin = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
        }

        const usuario = await Usuario.findOne({ where: { email: email } });

        if (!usuario || !(await usuario.validarSenha(senha))) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const payload = {
            id: usuario.id,
            email: usuario.email
        };

        const token = jwt.sign(payload, JWT_SECRET, {
            expiresIn: '1h' 
        });

        res.status(200).json({
            message: 'Login bem-sucedido!',
            token: token
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

exports.postEsqueciSenha = async (req, res) => {
    try {
        const { email } = req.body;
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(200).json({ message: 'Se o email existir, um link de recuperação foi enviado.' });
        }

        const token = crypto.randomBytes(20).toString('hex');

        const agora = new Date();
        agora.setHours(agora.getHours() + 1);

        await usuario.update({
            resetPasswordToken: token,
            resetPasswordExpires: agora
        });

        console.log('------------------------------------------------');
        console.log(`Recuperação de Senha para: ${email}`);
        console.log(`Link (Copie o Token): http://localhost:5173/resetar-senha/${token}`);
        console.log(`TOKEN: ${token}`);
        console.log('------------------------------------------------');

        res.status(200).json({ message: 'Se o email existir, um link de recuperação foi enviado.' });

    } catch (error) {
        console.error('Erro no esqueci senha:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

exports.postResetarSenha = async (req, res) => {
    try {
        const { token, novaSenha } = req.body;

        if (!token || !novaSenha) {
            return res.status(400).json({ message: 'Token e nova senha são obrigatórios.' });
        }

        const usuario = await Usuario.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { [Op.gt]: new Date() }
            }
        });

        if (!usuario) {
            return res.status(400).json({ message: 'Token inválido ou expirado.' });
        }

        usuario.senha = novaSenha;
        usuario.resetPasswordToken = null;
        usuario.resetPasswordExpires = null;
        
        await usuario.save();

        res.status(200).json({ message: 'Senha alterada com sucesso. Faça login com a nova senha.' });

    } catch (error) {
        console.error('Erro no resetar senha:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};