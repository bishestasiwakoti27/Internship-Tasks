const jwtAuth = require("../middleware/jwtAuth");
const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const Order = require("../models/Order");

const transporter = require("../config/email");
//
// CREATE ORDER / CHECKOUT
// POST /orders
//
/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Place a new order
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer_name
 *               - products
 *           example:
 *             customer_name: Test User
 *             products:
 *               - productId: 64abc1234567890123456789
 *                 quantity: 2
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Invalid order or insufficient stock
 *       401:
 *         description: JWT token required
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.post("/", jwtAuth, async (req, res) => {
  try {
    const { customer_name, products } = req.body;

    let totalPrice = 0;

    // Find logged-in user
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

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

    // ==========================================
    // SEND INVOICE EMAIL
    // ==========================================

    const productDetails = [];

    for (const item of products) {
      const product = await Product.findById(item.productId);

      if (product) {
        productDetails.push(`
          <tr>
            <td>${product.name}</td>
            <td>${item.quantity}</td>
            <td>Rs. ${product.price}</td>
            <td>Rs. ${product.price * item.quantity}</td>
          </tr>
        `);
      }
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Invoice for Order ${savedOrder._id}`,
      html: `
        <h2>Shopping API - Invoice</h2>

        <p>Hello ${customer_name},</p>

        <p>Thank you for your order!</p>

        <p>
          <strong>Order ID:</strong> ${savedOrder._id}
        </p>

        <table border="1" cellpadding="10" cellspacing="0">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            ${productDetails.join("")}
          </tbody>
        </table>

        <h3>Total Amount: Rs. ${totalPrice}</h3>

        <p>Thank you for shopping with us.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(201).json({
      message: "Order Placed Successfully and Invoice Sent",
      order: savedOrder,
      invoiceEmail: user.email,
    });
  } catch (err) {
    console.log("Checkout Error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});
//
// GET ORDER HISTORY
//
/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get order history
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *       401:
 *         description: JWT token required
 *       500:
 *         description: Server error
 */
router.get("/", jwtAuth, async (req, res) => {
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
