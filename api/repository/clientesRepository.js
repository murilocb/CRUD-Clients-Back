const { Client } = require("pg");
const { calcularDistanciaEmKm } = require("../../utils/geolocation");

async function getAllClientes(filters) {
  const client = new Client();

  try {
    await client.connect();

    let queryString = "SELECT *, to_char(created_at, 'DD/MM/YYYY') AS created_at FROM clientes";

    // Construir a cláusula WHERE com base nos filtros
    if (filters) {
      const conditions = [];

      if (filters.id) {
        conditions.push(`id = ${filters.id}`);
      }

      if (filters.nome) {
        conditions.push(`nome LIKE '%${filters.nome}%'`);
      }

      if (filters.email) {
        conditions.push(`email LIKE '%${filters.email}%'`);
      }

      if (filters.telefone) {
        conditions.push(`telefone LIKE '%${filters.telefone}%'`);
      }

      if (filters.created_at) {
        conditions.push(`to_char(created_at, 'DD/MM/YYYY') = '${filters.created_at}'`);
      }

      if (conditions.length > 0) {
        queryString += " WHERE " + conditions.join(" AND ");
      }
    }

    const result = await client.query(queryString);
    const clientes = result.rows;
    const ordemVisita = [];

    // Calcula a distância em km para cada cliente
    if (filters.lat && filters.lon) {
      for (const cliente of clientes) {
        cliente.distancia_km = calcularDistanciaEmKm(
          filters.lat,
          filters.lon,
          cliente.coordenada_x,
          cliente.coordenada_y
        );
      }
      // Ordena os clientes por distância da empresa
      ordemVisita.push(clientes.sort((a, b) => a.distancia_km - b.distancia_km));
    }

    return clientes;
  } catch (error) {
    throw error;
  } finally {
    await client.end();
  }
}

async function createCliente(cliente) {
  const client = new Client();
  try {
    await client.connect();
    const result = await client.query(
      `INSERT INTO clientes (nome, email, telefone, coordenada_x, coordenada_y, created_at)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        cliente.nome,
        cliente.email,
        cliente.telefone,
        cliente.coordenada_x,
        cliente.coordenada_y,
        new Date().toISOString(),
      ]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  } finally {
    await client.end();
  }
}

async function updateCliente(id, cliente) {
  const client = new Client();
  try {
    await client.connect();
    const result = await client.query(
      `UPDATE clientes SET nome = $1, email = $2, telefone = $3, coordenada_x = $4, coordenada_y = $5
     WHERE id = $6 RETURNING *`,
      [cliente.nome, cliente.email, cliente.telefone, cliente.coordenada_x, cliente.coordenada_y, id]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  } finally {
    await client.end();
  }
}

async function deleteCliente(id) {
  const client = new Client();
  try {
    await client.connect();
    await client.query(`DELETE FROM clientes WHERE id = $1`, [id]);
  } catch (error) {
    throw error;
  } finally {
    await client.end();
  }
}

module.exports = {
  getAllClientes,
  createCliente,
  updateCliente,
  deleteCliente,
};
