const { body, validationResult } = require('express-validator');

const validaReserva = () => {
  return [
    body('cliente_id')
      .notEmpty().withMessage('O ID do cliente é obrigatório.')
      .isInt({ gt: 0 }).withMessage('O ID do cliente deve ser um número inteiro positivo.'),

    body('quarto_id')
      .notEmpty().withMessage('O ID do quarto é obrigatório.')
      .isInt({ gt: 0 }).withMessage('O ID do quarto deve ser um número inteiro positivo.'),

    body('data_checkin')
      .notEmpty().withMessage('A data de check-in é obrigatória.')
      .isISO8601().toDate().withMessage('A data de check-in deve estar no formato de data (ISO8601).'),

    body('data_checkout')
      .notEmpty().withMessage('A data de check-out é obrigatória.')
      .isISO8601().toDate().withMessage('A data de check-out deve estar no formato de data (ISO8601).'),

    body('status')
      .optional()
      .isIn(['Pendente', 'Confirmada', 'Cancelada']).withMessage('Status inválido. Use: Pendente, Confirmada, ou Cancelada.')
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
  validaReserva,
  validar
};