const express = require('express');
const router = express.Router();

const clientesRoutes = require('./clientes');

router.use('/clientes', clientesRoutes);

router.use('*', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

module.exports = router;