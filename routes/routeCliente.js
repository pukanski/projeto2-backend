const express = require('express');
const router = express.Router();
const controllerCliente = require('../controllers/controllerCliente');

router.post('/', controllerCliente.create);
router.get('/', controllerCliente.getAll);
router.get('/:id', controllerCliente.getById);
router.put('/:id', controllerCliente.update);
router.delete('/:id', controllerCliente.delete);

module.exports = router;