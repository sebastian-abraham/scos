// routes/orders.js
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController.js");
const authenticateUser = require("../middleware/authMiddleware");

// Get all orders for the current authenticated user
router.get("/my", authenticateUser(), orderController.getOrdersForCurrentUser);
// Protect all order routes
router.get("/", authenticateUser(), orderController.getAllOrders);
router.post("/", authenticateUser(), orderController.createOrder);
router.get("/:id", authenticateUser(), orderController.getOrderById);
router.put("/:id", authenticateUser(), orderController.updateOrderById);
router.delete("/:id", authenticateUser(), orderController.deleteOrderById);

module.exports = router;
