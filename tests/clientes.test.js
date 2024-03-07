require('dotenv').config()
const app = require('../app');
const axios = require('axios');
const clientesRepository = require('../api/repository/clientesRepository');


let id;
const url = `http://localhost:${process.env.PORTA}/clientes`;
beforeAll(async () => {
  await app.listen(); // Inicie o servidor
});

describe('criar cliente', () => {
  it('deve criar um novo cliente', async () => {
    const novoCliente = {
      nome: 'Novo Cliente',
      email: 'novo@cliente.com',
      telefone: '987654321',
      coordenada_x: 123.45,
      coordenada_y: 67.89
    };
    const response = await axios.post(url, novoCliente);

    // Verificar os dados do cliente criado
    id = response.data.id;
    expect(response.data.nome).toBe('Novo Cliente');
    expect(response.data.email).toBe('novo@cliente.com');
    expect(response.data.telefone).toBe('987654321');
    expect(response.data.coordenada_x).toBe(123.45);
    expect(response.data.coordenada_y).toBe(67.89);
    expect(response.status).toBe(200);
  });
});

describe('get todos clientes', () => {
  it('deve retornar todos os clientes', async () => {
    const response = await axios.get(url);
    expect(response.status).toBe(200);
  });
});

describe('getAllClientes com filtros', () => {
  it('deve retornar todos os cliente por id', async () => {
    const clientes = await clientesRepository.getAllClientes({ id });
    expect(clientes).toHaveLength(1); // Supondo que você tem 1 cliente com o id na base de dados
  });

  it('deve retornar todos os clientes com o nome "Novo Cliente"', async () => {
    const clientes = await clientesRepository.getAllClientes({ nome: 'Novo Cliente' });
    expect(clientes).toHaveLength(1); // Supondo que você tem 1 cliente com o nome "Novo Cliente" na base de dados
  });

  it('deve retornar todos os clientes com o email', async () => {
    const clientes = await clientesRepository.getAllClientes({ email: 'novo@cliente.com' })
    expect(clientes).toHaveLength(1); // Supondo que você tem 1 cliente com o email "
  });

  it('deve retornar todos os clientes com o telefone', async () => {
    const clientes = await clientesRepository.getAllClientes({ telefone: '987654321' });
    expect(clientes).toHaveLength(1); // Supondo que você tem 1 cliente com o telefone "987654321"
  });
});

describe('deleteClient', () => {
  it('deve deletar um cliente pelo id', async () => {
    const response = await axios.delete(`${url + '/' + id}`);
    expect(response.status).toBe(200);
  });
});
