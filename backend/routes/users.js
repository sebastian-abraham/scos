// routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

// GET /api/users/
router.get('/', userController.getAllUsers);

// POST /api/users/
router.post('/', userController.createUser);

// GET /api/users/:id
router.get('/:id', userController.getUserById);

module.exports = router;