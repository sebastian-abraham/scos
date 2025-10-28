const orderItemQueries = require("../queries/orderItemQueries");
const orderQueries = require("../queries/orderQueries");
const itemQueries = require("../queries/itemQueries");

// Add item to cart (create order if not exists, add/update order_item, update order total)
const addToCart = async (req, res) => {
  try {
    const { student_id, shop_id, item_id, quantity = 1 } = req.body;
    // 1. Find or create a pending order for this student/shop
    let order = await orderQueries.findPendingOrder(student_id, shop_id);
    if (!order) {
      order = await orderQueries.createOrder({
        student_id,
        shop_id,
        total_amount: 0,
        order_status: "Pending",
      });
    }
    // 2. Add or update order_item
    let orderItem = await orderItemQueries.findOrderItem(order.id, item_id);
    if (orderItem) {
      orderItem = await orderItemQueries.updateOrderItemQuantity(
        order.id,
        item_id,
        quantity
      );
    } else {
      orderItem = await orderItemQueries.createOrderItem(order.id, item_id, quantity);
    }
    // 3. Recalculate order total
    const orderItems = await orderItemQueries.getOrderItems(order.id);
    let total = 0;
    for (const oi of orderItems) {
      total += Number(oi.price) * oi.quantity;
    }
    await orderQueries.updateOrderById(order.id, { total_amount: total });
    // 4. Return updated order/cart
    res.status(200).json({ order_id: order.id, total_amount: total, items: orderItems });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addToCart,
};
