const jwt = require('jsonwebtoken');

const JWT_SENHA = 'segredo';

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Autenticação falhou: Token não fornecido' });
        }

        const token = authHeader.split(' ')[1];

        const tokenDecodificado = jwt.verify(token, JWT_SENHA);

        req.userData = { 
            id: tokenDecodificado.id, 
            email: tokenDecodificado.email 
        };

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Autenticação falhou: Token inválido ou expirado.' });
    }
};