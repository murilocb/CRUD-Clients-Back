const { Client } = require('pg');
require('dotenv').config();

// Configurações de conexão com o banco de dados
const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: 'postgres', // Conectar ao banco de dados padrão para operações administrativas
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT // Porta padrão do PostgreSQL
});

// Função para conectar ao banco de dados
async function connect() {
  try {
    await client.connect(); // Conecta ao banco de dados
    console.log('Conexão com o banco de dados estabelecida com sucesso');

    // Verificar se o banco de dados já existe
    const queryVerificarBanco = "SELECT 1 FROM pg_database WHERE datname = $1";
    const resultBanco = await client.query(queryVerificarBanco, [process.env.PGDATABASE]);
    const bancoExiste = resultBanco.rows.length > 0;

    if (!bancoExiste) {
      // Criar o banco de dados
      const queryCriarBanco = `CREATE DATABASE ${process.env.PGDATABASE}`;
      await client.query(queryCriarBanco);
      console.log('Banco de dados criado com sucesso.');

      // Reconectar ao PostgreSQL com o novo banco de dados selecionado
      await client.end();
      client.database = process.env.PGDATABASE;
      await client.connect();
    }

    // Verificar se a tabela clientes já existe
    const queryVerificarTabela = `
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'clientes'
    `;
    const resultTabela = await client.query(queryVerificarTabela);
    const tabelaExiste = resultTabela.rows.length > 0;

    if (!tabelaExiste) {
      // Criar a tabela clientes
      const queryCriarTabela = `
        CREATE TABLE clientes (
          id SERIAL PRIMARY KEY,
          nome VARCHAR(100),
          email VARCHAR(100),
          telefone VARCHAR(20),
          coordenada_x DOUBLE PRECISION,
          coordenada_y DOUBLE PRECISION,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      await client.query(queryCriarTabela);
      console.log('Tabela clientes criada com sucesso.');
    }
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados', error);
  } finally {
    await client.end(); // Fechar a conexão com o banco de dados
  }
}

connect(); // Conecta ao banco de dados
