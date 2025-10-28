const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController.js");
const authenticateUser = require("../middleware/authMiddleware");

// Add to cart (create order if not exists, add/update order_item, update order total)
router.post("/add", authenticateUser(), cartController.addToCart);

module.exports = router;
