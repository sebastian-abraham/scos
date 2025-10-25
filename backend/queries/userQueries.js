// Find a panel user by their Firebase admin UID (for authentication)
const findPanelUserByFbId = async (fbId) => {
  const { rows } = await db.query(
    "SELECT * FROM panel_users WHERE fb_id = $1 LIMIT 1",
    [fbId]
  );
  return rows[0];
};

// queries/userQueries.js
const db = require("../config/db"); // Import the connection pool

const findAllUsers = async () => {
  const { rows } = await db.query("SELECT * FROM users ORDER BY id ASC");
  return rows;
};

const findUserById = async (id) => {
  const { rows } = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  return rows[0]; // Return the first row (or undefined if not found)
};

const createNewUser = async (username, email) => {
  const { rows } = await db.query(
    "INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *",
    [username, email]
  );
  return rows[0]; // Return the newly created user
};

module.exports = {
  findAllUsers,
  findUserById,
  createNewUser,
  findPanelUserByAdminId,
};
