const express = require('express');
const router = express.Router();
const controllerCliente = require('../controllers/controllerCliente');
const { validaCliente, validar } = require('../validators/validatorCliente');

router.post('/', validaCliente(), validar, controllerCliente.create);
router.put('/:id', validaCliente(), validar, controllerCliente.update);

router.get('/', controllerCliente.getAll);
router.get('/:id', controllerCliente.getById);
router.delete('/:id', controllerCliente.delete);

module.exports = router;