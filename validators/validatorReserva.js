const { body, validationResult } = require('express-validator');

const validaReserva = () => {
  return [
    body('cliente_id')
      .optional()
      .isInt({ gt: 0 }).withMessage('O ID do cliente deve ser um número inteiro positivo.'),

    body('quarto_id')
      .optional()
      .isInt({ gt: 0 }).withMessage('O ID do quarto deve ser um número inteiro positivo.'),

    body('data_checkin')
      .optional()
      .isISO8601().toDate().withMessage('A data de check-in deve estar no formato de data (ISO8601).'),

    body('data_checkout')
      .optional()
      .isISO8601().toDate().withMessage('A data de check-out deve estar no formato de data (ISO8601).'),

    body('status')
      .optional()
      .isIn(['Pendente', 'Confirmada', 'Cancelada']).withMessage('Status inválido. Use: Pendente, Confirmada, ou Cancelada.')
  ];
};

const validar = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (req.method === 'POST') {
    const { cliente_id, quarto_id, data_checkin, data_checkout } = req.body;
    const camposFaltando = [];
    if (!cliente_id) camposFaltando.push('cliente_id');
    if (!quarto_id) camposFaltando.push('quarto_id');
    if (!data_checkin) camposFaltando.push('data_checkin');
    if (!data_checkout) camposFaltando.push('data_checkout');

    if (camposFaltando.length > 0) {
      return res.status(400).json({ 
        message: 'Campos obrigatórios faltando para criação.', 
        campos: camposFaltando 
      });
    }
  }

  next();
};

module.exports = {
  validaReserva,
  validar
};