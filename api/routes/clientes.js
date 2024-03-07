const express = require('express');
const clientesController = require('../controllers/clientes');
const router = express.Router();

router.get('/', (req, res) => {
  clientesController.getAll(req, res);
});

router.post('/', (req, res) => {
  clientesController.create(req, res);
});

router.put('/:id', (req, res) => {
  clientesController.update(req, res);
});

router.delete('/:id', (req, res) => {
  clientesController.delete(req, res);
});

module.exports = router;

