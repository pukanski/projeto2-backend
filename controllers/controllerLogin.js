const jwt = require('jsonwebtoken');
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
    res.status(501).json({ message: 'Funcionalidade (Esqueci Senha) não implementada.' });
};

exports.postResetarSenha = async (req, res) => {
    res.status(501).json({ message: 'Funcionalidade (Resetar Senha) não implementada.' });
};