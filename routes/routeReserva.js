const express = require('express');
const router = express.Router();
const controllerReserva = require('../controllers/controllerReserva');

router.post('/', controllerReserva.create);
router.get('/', controllerReserva.getAll);
router.get('/:id', controllerReserva.getById);
router.put('/:id', controllerReserva.update);
router.delete('/:id', controllerReserva.delete);

module.exports = router;