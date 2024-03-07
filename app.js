const express = require('express');
require('dotenv').config()
const routes = require('./api/routes');
const app = express();

app.use(express.json());
app.use(routes);

app.listen(process.env.PORTA, () => {
  console.log(`API rodando na porta ${process.env.PORTA}`);
});

module.exports = app;