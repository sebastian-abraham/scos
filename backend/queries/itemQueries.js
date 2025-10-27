const db = require("../config/db");

// Get all items (optionally by shop)
const findAllItems = async (shopId) => {
  if (shopId) {
    const { rows } = await db.query(
      "SELECT * FROM items WHERE shop_id = $1 ORDER BY id ASC",
      [shopId]
    );
    return rows;
  } else {
    const { rows } = await db.query("SELECT * FROM items ORDER BY id ASC");
    return rows;
  }
};

const findItemById = async (id) => {
  const { rows } = await db.query("SELECT * FROM items WHERE id = $1", [id]);
  return rows[0];
};

const createItem = async (data) => {
  const { shop_id, name, description, price, image_url, tags, quantity } = data;
  const { rows } = await db.query(
    `INSERT INTO items (shop_id, name, description, price, image_url, tags, quantity)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [shop_id, name, description, price, image_url, tags, quantity]
  );
  return rows[0];
};

const updateItemById = async (id, data) => {
  const keys = Object.keys(data);
  if (!keys.length) return null;
  const setClause = keys.map((k, i) => `${k} = $${i + 2}`).join(", ");
  const values = [id, ...keys.map((k) => data[k])];
  const { rowCount } = await db.query(
    `UPDATE items SET ${setClause} WHERE id = $1`,
    values
  );
  if (rowCount === 0) return null;
  const { rows } = await db.query("SELECT * FROM items WHERE id = $1", [id]);
  return rows[0];
};

const deleteItemById = async (id) => {
  const { rowCount } = await db.query("DELETE FROM items WHERE id = $1", [id]);
  return rowCount > 0;
};

module.exports = {
  findAllItems,
  findItemById,
  createItem,
  updateItemById,
  deleteItemById,
};
