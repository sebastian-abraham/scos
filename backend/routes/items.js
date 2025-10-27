// routes/items.js
const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController.js");
const authenticateUser = require("../middleware/authMiddleware");

// Protect all item routes
router.get("/", authenticateUser(), itemController.getAllItems);
router.post("/", authenticateUser(), itemController.createItem);
router.get("/:id", authenticateUser(), itemController.getItemById);
router.put("/:id", authenticateUser(), itemController.updateItemById);
router.delete("/:id", authenticateUser(), itemController.deleteItemById);

module.exports = router;
