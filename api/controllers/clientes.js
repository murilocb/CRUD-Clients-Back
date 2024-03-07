const clientesRepository = require('../repository/clientesRepository');

module.exports = {
  async getAll(req, res) {
    try {
      const clientes = await clientesRepository.getAllClientes(req.query);
      res.status(200).json(clientes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const cliente = await clientesRepository.createCliente(req.body);
      res.status(200).json(cliente);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const cliente = await clientesRepository.updateCliente(req.params.id, req.body);
      res.status(200).json(cliente);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      await clientesRepository.deleteCliente(req.params.id);
      res.status(200).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};