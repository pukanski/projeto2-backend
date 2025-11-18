const express = require('express');
const router = express.Router();
const controller = require('../controllers/controllerReserva');
const { validaReserva, validar } = require('../validators/validatorReserva');

router.post('/', validaReserva(), validar, controller.create);
router.put('/:id', validaReserva(), validar, controller.update);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.delete('/:id', controller.delete);

module.exports = router;