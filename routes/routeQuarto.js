const express = require('express');
const router = express.Router();
const controller = require('../controllers/controllerQuarto');
const { validaQuarto, validar } = require('../validators/validatorQuarto');

router.post('/', validaQuarto(), validar, controller.create);
router.put('/:id', validaQuarto(), validar, controller.update);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.delete('/:id', controller.delete);

module.exports = router;