const express = require('express');
const router = express.Router();
const controllerQuarto = require('../controllers/controllerQuarto');

router.post('/', controllerQuarto.create);
router.get('/', controllerQuarto.getAll);
router.get('/:id', controllerQuarto.getById);
router.put('/:id', controllerQuarto.update);
router.delete('/:id', controllerQuarto.delete);

module.exports = router;