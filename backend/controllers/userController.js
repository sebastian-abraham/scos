// controllers/userController.js
const queries = require("../queries/userQueries.js");

const getAllUsers = async (req, res) => {
  try {
    const users = await queries.findAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await queries.findUserById(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createUser = async (req, res) => {
  const { username, email } = req.body;
  try {
    const newUser = await queries.createNewUser(username, email);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete user by ID
const deleteUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await queries.deleteUserById(id);
    if (!deleted) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json({ msg: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  deleteUserById,
};

