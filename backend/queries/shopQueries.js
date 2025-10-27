// queries/shopQueries.js
const db = require("../config/db");

const findAllShops = async () => {
  // Join shops with users to get shopkeeper details
  const { rows } = await db.query(`
    SELECT s.*, 
           json_build_object(
             'id', u.id,
             'uuid', u.uuid,
             'email', u.email,
             'firstname', u.firstname,
             'lastname', u.lastname,
             'imageurl', u.imageurl,
             'role', u.role,
             'created_at', u.created_at
           ) AS shopkeeper
    FROM shops s
    JOIN users u ON s.shopkeeper_id = u.id
    ORDER BY s.id ASC
  `);
  return rows;
};

const findShopById = async (id) => {
  // Join shops with users to get shopkeeper details
  const { rows } = await db.query(
    `
    SELECT s.*, 
           json_build_object(
             'id', u.id,
             'uuid', u.uuid,
             'email', u.email,
             'firstname', u.firstname,
             'lastname', u.lastname,
             'imageurl', u.imageurl,
             'role', u.role,
             'created_at', u.created_at
           ) AS shopkeeper
    FROM shops s
    JOIN users u ON s.shopkeeper_id = u.id
    WHERE s.id = $1
  `,
    [id]
  );
  return rows[0];
};

const createShop = async (data, file) => {
  // Convert camelCase to snake_case for DB fields
  const name = data.name;
  const location = data.location;
  const open_time = data.openTime;
  const close_time = data.closeTime;
  const shopkeeper_id = data.shopkeeperId;
  const is_active = data.isActive !== undefined ? data.isActive : true;
  let shop_image = null;
  if (file && file.buffer) {
    shop_image = file.buffer;
  }
  const { rows } = await db.query(
    `INSERT INTO shops (name, location, shop_image, open_time, close_time, shopkeeper_id, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      name,
      location,
      shop_image,
      open_time,
      close_time,
      shopkeeper_id,
      is_active,
    ]
  );
  return rows[0];
};

const updateShopById = async (id, data, file) => {
  const keys = Object.keys(data);
  let setClause = keys.map((k, i) => `${k} = $${i + 2}`).join(", ");
  let values = [id, ...keys.map((k) => data[k])];
  if (file && file.buffer) {
    setClause += setClause
      ? ", shop_image = $" + (values.length + 1)
      : "shop_image = $2";
    values.push(file.buffer);
  }
  if (!setClause) return null;
  const { rowCount } = await db.query(
    `UPDATE shops SET ${setClause} WHERE id = $1`,
    values
  );
  if (rowCount === 0) return null;
  const { rows } = await db.query("SELECT * FROM shops WHERE id = $1", [id]);
  return rows[0];
};

const deleteShopById = async (id) => {
  const { rowCount } = await db.query("DELETE FROM shops WHERE id = $1", [id]);
  return rowCount > 0;
};

module.exports = {
  findAllShops,
  findShopById,
  createShop,
  updateShopById,
  deleteShopById,
};
