const express = require("express");
const router = express.Router();

const pool = require("../config/db");

let cart = [];

//
// GET ORDER HISTORY
//
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM orders ORDER BY created_at DESC",
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

//
// ADD TO CART
//
router.post("/cart", async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const result = await pool.query("SELECT * FROM products WHERE id = $1", [
      productId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const product = result.rows[0];

    if (product.quantity < quantity) {
      return res.status(400).json({
        message: "Not enough stock",
      });
    }

    cart.push({
      productId,
      name: product.name,
      price: Number(product.price),
      quantity,
    });

    res.json({
      message: "Added to cart",
      cart,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
//
// VIEW CART
//
router.get("/cart", (req, res) => {
  res.json(cart);
});
module.exports = router;
