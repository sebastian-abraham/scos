
const queries = require("../queries/itemQueries.js");

const getAllItems = async (req, res) => {
  try {
    const items = await queries.findAllItems(req.query.shop_id);
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await queries.findItemById(id);
    if (!item) return res.status(404).json({ msg: "Item not found" });
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createItem = async (req, res) => {
  try {
    const newItem = await queries.createItem(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await queries.updateItemById(id, req.body);
    if (!updated) return res.status(404).json({ msg: "Item not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await queries.deleteItemById(id);
    if (!deleted) return res.status(404).json({ msg: "Item not found" });
    res.status(200).json({ msg: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItemById,
  deleteItemById,
};
