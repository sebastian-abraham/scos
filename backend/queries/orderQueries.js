// queries/orderQueries.js
const db = require("../config/db");


const findAllOrders = async () => {
  const { rows } = await db.query("SELECT * FROM orders ORDER BY id ASC");
  return rows;
};

// Find a pending order for a student and shop
const findPendingOrder = async (student_id, shop_id) => {
  const { rows } = await db.query(
    `SELECT * FROM orders WHERE student_id = $1 AND shop_id = $2 AND order_status = 'Pending' LIMIT 1`,
    [student_id, shop_id]
  );
  return rows[0];
};

const findOrderById = async (id) => {
  const { rows } = await db.query("SELECT * FROM orders WHERE id = $1", [id]);
  return rows[0];
};

const createOrder = async (data) => {
  // Example fields: user_id, shop_id, total, status
  const { student_id, shop_id, total_amount, order_status } = data;
  const { rows } = await db.query(
    `INSERT INTO orders (student_id, shop_id, total_amount, order_status) VALUES ($1, $2, $3, $4) RETURNING *`,
    [student_id, shop_id, total_amount, order_status]
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
  findPendingOrder,
};
