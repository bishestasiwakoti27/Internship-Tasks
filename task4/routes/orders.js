const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const Order = require("../models/Order");

//
// CREATE ORDER
//
router.post("/", async (req, res) => {
  try {
    const { customer_name, products } = req.body;

    let totalPrice = 0;

    // Check every product
    for (const item of products) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}`,
        });
      }

      // Calculate total
      totalPrice += product.price * item.quantity;

      // Reduce stock
      product.quantity -= item.quantity;
      await product.save();
    }

    // Minimum order amount
    if (totalPrice < 1000) {
      return res.status(400).json({
        message: "Minimum order amount is 1000",
      });
    }

    // Save order
    const order = new Order({
      customer_name,
      products,
      totalPrice,
    });

    const savedOrder = await order.save();

    res.status(201).json({
      message: "Order Placed Successfully",
      order: savedOrder,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

//
// GET ORDER HISTORY
//
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("products.productId");

    res.json(orders);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;
