const db = require("../config/db"); // Import the connection pool

// Find auser by email
const findUserByEmail = async (email) => {
  const { rows } = await db.query(
    "SELECT * FROM users WHERE email = $1 LIMIT 1",
    [email]
  );
  return rows[0];
};

// Create a newuser
const createUser = async ({ email, uuid, firstName, lastName, imageUrl }) => {
  const { rows } = await db.query(
    `INSERT INTO users (email, uuid, firstname, lastname, imageurl)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [email, uuid, firstName, lastName, imageUrl]
  );
  return rows[0];
};

// Update user fields by email
const updateUserFields = async (email, fields) => {
  // Build dynamic SET clause
  const keys = Object.keys(fields);
  if (keys.length === 0) return;
  const setClause = keys.map((k, i) => `${k} = $${i + 2}`).join(", ");
  const values = [email, ...keys.map((k) => fields[k])];
  await db.query(`UPDATE users SET ${setClause} WHERE email = $1`, values);
};
// Find auser by their Firebase admin UID (for authentication)
const findUserByUuid = async (uuid) => {
  const { rows } = await db.query(
    "SELECT * FROM users WHERE uuid = $1 LIMIT 1",
    [uuid]
  );
  return rows[0];
};

// queries/userQueries.js

const findAllUsers = async () => {
  const { rows } = await db.query("SELECT * FROM users ORDER BY id ASC");
  return rows;
};

const findUserById = async (id) => {
  const { rows } = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  return rows[0]; // Return the first row (or undefined if not found)
};

const createNewUser = async (firstname, lastname, email, role) => {
  const { rows } = await db.query(
    "INSERT INTO users (firstname, lastname, email, role) VALUES ($1, $2, $3, $4) RETURNING *",
    [firstname, lastname, email, role]
  );
  return rows[0]; // Return the newly created user
};

const deleteUserById = async (id) => {
  const { rowCount } = await db.query("DELETE FROM users WHERE id = $1", [id]);
  return rowCount > 0;
};

// Update user by ID
const updateUserById = async (id, fields) => {
  const keys = Object.keys(fields);
  if (keys.length === 0) return null;
  const setClause = keys.map((k, i) => `${k} = $${i + 2}`).join(", ");
  const values = [id, ...keys.map((k) => fields[k])];
  const { rowCount } = await db.query(`UPDATE users SET ${setClause} WHERE id = $1`, values);
  if (rowCount === 0) return null;
  const { rows } = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  return rows[0];
};

module.exports = {
  findAllUsers,
  findUserById,
  createNewUser,
  findUserByUuid,
  findUserByEmail,
  createUser,
  updateUserFields,
  updateUserById,
  deleteUserById,
};
