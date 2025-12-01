const { body, validationResult } = require('express-validator');

const validaQuarto = () => {
  return [
    body('numero')
      .notEmpty().withMessage('O número do quarto é obrigatório.'),

    body('tipo')
      .notEmpty().withMessage('O tipo do quarto é obrigatório.')
      .isIn(['Standard', 'Deluxe', 'Suíte']).withMessage('Tipo de quarto inválido. Use: Standard, Deluxe, ou Suíte.'),
      
    body('preco_diaria')
      .notEmpty().withMessage('O preço da diária é obrigatório.')
      .isFloat({ gt: 0 }).withMessage('O preço da diária deve ser um número positivo.'),

    body('status')
      .notEmpty().withMessage('O status é obrigatório.')
      .isIn(['Disponivel', 'Ocupado', 'Manutencao']).withMessage('Status inválido. Use: Disponivel, Ocupado, ou Manutencao.')
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
  validaQuarto,
  validar
};