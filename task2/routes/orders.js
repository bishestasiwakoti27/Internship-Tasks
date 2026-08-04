const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path");

const productsFile = path.join(__dirname, "../products.json");
const ordersFile = path.join(__dirname, "../orders.json");

// Read Products
function readProducts() {
  const data = fs.readFileSync(productsFile, "utf-8");
  return JSON.parse(data);
}

// Save Products
function saveProducts(products) {
  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
}

// Read Orders
function readOrders() {
  const data = fs.readFileSync(ordersFile, "utf-8");
  return JSON.parse(data);
}

// Save Orders
function saveOrders(orders) {
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
}

// Temporary Cart
let cart = [];

//
// ADD TO CART
//
router.post("/cart", (req, res) => {
  const products = readProducts();

  const product = products.find((p) => p.id === Number(req.body.productId));

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  if (product.quantity < req.body.quantity) {
    return res.status(400).json({
      message: "Not enough stock",
    });
  }

  cart.push({
    productId: product.id,
    name: product.name,
    price: product.price,
    quantity: req.body.quantity,
  });

  res.json({
    message: "Product added to cart",
    cart,
  });
});

//
// VIEW CART
//
router.get("/cart", (req, res) => {
  res.json(cart);
});

//
// CHECKOUT
//
router.post("/checkout", (req, res) => {
  const MIN_ORDER = 1000;

  const products = readProducts();
  const orders = readOrders();

  if (cart.length === 0) {
    return res.status(400).json({
      message: "Cart is empty",
    });
  }

  let total = 0;

  for (let item of cart) {
    total += item.price * item.quantity;
  }

  if (total < MIN_ORDER) {
    return res.status(400).json({
      message: `Minimum order amount is Rs. ${MIN_ORDER}`,
    });
  }

  // Update product quantities
  for (let item of cart) {
    const product = products.find((p) => p.id === item.productId);

    if (product) {
      product.quantity -= item.quantity;
    }
  }

  saveProducts(products);

  const order = {
    id: orders.length + 1,
    products: cart,
    totalPrice: total,
    date: new Date(),
  };

  orders.push(order);

  saveOrders(orders);

  cart = [];

  res.json({
    message: "Order placed successfully",
    order,
  });
});
//
// ORDER HISTORY
//
router.get("/", (req, res) => {
  const orders = readOrders();

  res.json(orders);
});

module.exports = router;
