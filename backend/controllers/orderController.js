// controllers/orderController.js
const queries = require("../queries/orderQueries.js");

const getAllOrders = async (req, res) => {
  try {
    const orders = await queries.findAllOrders();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await queries.findOrderById(id);
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const newOrder = await queries.createOrder(req.body);
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedOrder = await queries.updateOrderById(id, req.body);
    if (!updatedOrder) {
      return res.status(404).json({ msg: "Order not found" });
    }
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await queries.deleteOrderById(id);
    if (!deleted) {
      return res.status(404).json({ msg: "Order not found" });
    }
    res.status(200).json({ msg: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderById,
  deleteOrderById,
};
