// queries/orderQueries.js
const db = require("../config/db");

const findAllOrders = async () => {
  const { rows } = await db.query("SELECT * FROM orders ORDER BY id ASC");
  return rows;
};

const findOrderById = async (id) => {
  const { rows } = await db.query("SELECT * FROM orders WHERE id = $1", [id]);
  return rows[0];
};

const createOrder = async (data) => {
  // Example fields: user_id, shop_id, total, status
  const { user_id, shop_id, total, status } = data;
  const { rows } = await db.query(
    `INSERT INTO orders (user_id, shop_id, total, status) VALUES ($1, $2, $3, $4) RETURNING *`,
    [user_id, shop_id, total, status]
  );
  return rows[0];
};

const updateOrderById = async (id, data) => {
  const keys = Object.keys(data);
  let setClause = keys.map((k, i) => `${k} = $${i + 2}`).join(", ");
  let values = [id, ...keys.map((k) => data[k])];
  if (!setClause) return null;
  const { rowCount } = await db.query(
    `UPDATE orders SET ${setClause} WHERE id = $1`,
    values
  );
  if (rowCount === 0) return null;
  const { rows } = await db.query("SELECT * FROM orders WHERE id = $1", [id]);
  return rows[0];
};

const deleteOrderById = async (id) => {
  const { rowCount } = await db.query("DELETE FROM orders WHERE id = $1", [id]);
  return rowCount > 0;
};

module.exports = {
  findAllOrders,
  findOrderById,
  createOrder,
  updateOrderById,
  deleteOrderById,
};
