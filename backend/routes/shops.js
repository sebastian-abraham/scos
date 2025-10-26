// routes/shops.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const shopController = require("../controllers/shopController.js");
const authenticateUser = require("../middleware/authMiddleware");

// Protect all shop routes
router.get("/", authenticateUser(), shopController.getAllShops);
router.post(
  "/",
  authenticateUser(),
  upload.single("image"),
  shopController.createShop
);
router.get("/:id", authenticateUser(), shopController.getShopById);
router.put(
  "/:id",
  authenticateUser(),
  upload.single("image"),
  shopController.updateShopById
);
router.delete("/:id", authenticateUser(), shopController.deleteShopById);

module.exports = router;
