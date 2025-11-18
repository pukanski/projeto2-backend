const { body, validationResult } = require('express-validator');

const validaCliente = () => {
  return [
    body('nome')
      .notEmpty().withMessage('O campo nome é obrigatório.')
      .isLength({ min: 3 }).withMessage('O nome deve ter pelo menos 3 caracteres.'),

    body('email')
      .isEmail().withMessage('Forneça um endereço de email válido.'),

    body('cpf')
      .isLength({ min: 11, max: 14 }).withMessage('O CPF deve ter entre 11 e 14 caracteres.')
      .notEmpty().withMessage('O CPF é obrigatório.'),
      
    body('telefone')
      .optional({ checkFalsy: true })
      .isMobilePhone('pt-BR').withMessage('Forneça um número de telefone válido.')
  ];
};

const validar = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  
  return res.status(400).json({ errors: errors.array() });
};

module.exports = {
  validaCliente, 
  validar
};