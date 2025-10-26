// controllers/shopController.js
const queries = require("../queries/shopQueries.js");

const getAllShops = async (req, res) => {
  try {
    const shops = await queries.findAllShops();
    res.status(200).json(shops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getShopById = async (req, res) => {
  const { id } = req.params;
  try {
    const shop = await queries.findShopById(id);
    if (!shop) {
      return res.status(404).json({ msg: "Shop not found" });
    }
    res.status(200).json(shop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const userQueries = require("../queries/userQueries.js");
const createShop = async (req, res) => {
  try {
    // Find shopkeeper by email
    const { shopkeeperEmail, ...rest } = req.body;
    const shopkeeper = await userQueries.findUserByEmail(shopkeeperEmail);
    if (!shopkeeper) {
      return res.status(400).json({ error: "Shopkeeper email not found" });
    }
    const shopData = {
      ...rest,
      shopkeeperId: shopkeeper.id,
    };
    const newShop = await queries.createShop(shopData, req.file);
    res.status(201).json(newShop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateShopById = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedShop = await queries.updateShopById(id, req.body, req.file);
    if (!updatedShop) {
      return res.status(404).json({ msg: "Shop not found" });
    }
    res.status(200).json(updatedShop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteShopById = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await queries.deleteShopById(id);
    if (!deleted) {
      return res.status(404).json({ msg: "Shop not found" });
    }
    res.status(200).json({ msg: "Shop deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllShops,
  getShopById,
  createShop,
  updateShopById,
  deleteShopById,
};
