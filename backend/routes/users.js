// routes/users.js
const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController.js");
const authenticateUser = require("../middleware/authMiddleware");

// Protect all user routes

router.get("/", authenticateUser(), userController.getAllUsers);
router.post("/", authenticateUser(), userController.createUser);
router.get("/:id", authenticateUser(), userController.getUserById);
router.delete("/:id", authenticateUser(), userController.deleteUserById);

module.exports = router;
