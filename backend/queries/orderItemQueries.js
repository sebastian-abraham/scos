const db = require("../config/db");

const findOrderItem = async (order_id, item_id) => {
  const { rows } = await db.query(
    "SELECT * FROM order_items WHERE order_id = $1 AND item_id = $2",
    [order_id, item_id]
  );
  return rows[0];
};

const createOrderItem = async (order_id, item_id, quantity) => {
  const { rows } = await db.query(
    `INSERT INTO order_items (order_id, item_id, quantity) VALUES ($1, $2, $3) RETURNING *`,
    [order_id, item_id, quantity]
  );
  return rows[0];
};

const updateOrderItemQuantity = async (order_id, item_id, quantity) => {
  const { rows } = await db.query(
    `UPDATE order_items SET quantity = $3 WHERE order_id = $1 AND item_id = $2 RETURNING *`,
    [order_id, item_id, quantity]
  );
  return rows[0];
};

const getOrderItems = async (order_id) => {
  const { rows } = await db.query(
    `SELECT oi.*, i.price FROM order_items oi JOIN items i ON oi.item_id = i.id WHERE oi.order_id = $1`,
    [order_id]
  );
  return rows;
};

module.exports = {
  findOrderItem,
  createOrderItem,
  updateOrderItemQuantity,
  getOrderItems,
};
