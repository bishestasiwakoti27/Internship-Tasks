const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../products.json");

// Read Products
function readProducts() {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

// Save Products
function saveProducts(products) {
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
}

//
// GET ALL PRODUCTS
//
router.get("/", (req, res) => {
  const products = readProducts();
  res.json(products);
});

//
// SEARCH + FILTER + SORT PRODUCTS
//
router.get("/search", (req, res) => {
  let products = readProducts();

  const search = req.query.search;
  const product_type = req.query.product_type;
  const sort = req.query.sort;

  // Search by name or description
  if (search) {
    products = products.filter((product) => {
      const name = product.name ? product.name.toLowerCase() : "";
      const description = product.description
        ? product.description.toLowerCase()
        : "";

      return (
        name.includes(search.toLowerCase()) ||
        description.includes(search.toLowerCase())
      );
    });
  }

  // Filter by product type
  if (product_type) {
    products = products.filter(
      (product) =>
        product.product_type &&
        product.product_type.toLowerCase() === product_type.toLowerCase(),
    );
  }

  // Sort by price
  if (sort === "asc") {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === "desc") {
    products.sort((a, b) => b.price - a.price);
  }

  res.json(products);
});

//
// OUT OF STOCK PRODUCTS
//
router.get("/out-of-stock", (req, res) => {
  const products = readProducts();

  const outOfStock = products.filter((product) => product.quantity < 5);

  res.json(outOfStock);
});

//
// GET PRODUCT BY ID
//
router.get("/:id", (req, res) => {
  const products = readProducts();

  const id = Number(req.params.id);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.json(product);
});

//
// CREATE PRODUCT
//
router.post("/", (req, res) => {
  const products = readProducts();

  const newProduct = {
    id: products.length + 1,
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    quantity: req.body.quantity,
    product_type: req.body.product_type,
  };

  products.push(newProduct);

  saveProducts(products);

  res.status(201).json({
    message: "Product Added Successfully",
    product: newProduct,
  });
});

//
// UPDATE PRODUCT (PUT)
//
router.put("/:id", (req, res) => {
  const products = readProducts();

  const id = Number(req.params.id);

  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  products[index] = {
    id: id,
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    quantity: req.body.quantity,
    product_type: req.body.product_type,
  };

  saveProducts(products);

  res.json({
    message: "Product Updated Successfully",
    product: products[index],
  });
});
//
// UPDATE PRODUCT QUANTITY
//
router.patch("/:id/quantity", (req, res) => {
  const products = readProducts();

  const id = Number(req.params.id);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  product.quantity = req.body.quantity;

  saveProducts(products);

  res.json({
    message: "Quantity Updated Successfully",
    product,
  });
});

//
// PARTIAL UPDATE (PATCH)
//
router.patch("/:id", (req, res) => {
  const products = readProducts();

  const id = Number(req.params.id);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  if (req.body.name !== undefined) {
    product.name = req.body.name;
  }

  if (req.body.price !== undefined) {
    product.price = req.body.price;
  }

  if (req.body.description !== undefined) {
    product.description = req.body.description;
  }

  if (req.body.quantity !== undefined) {
    product.quantity = req.body.quantity;
  }

  if (req.body.product_type !== undefined) {
    product.product_type = req.body.product_type;
  }

  saveProducts(products);

  res.json({
    message: "Product Updated Successfully",
    product,
  });
});

//
// DELETE PRODUCT
//
router.delete("/:id", (req, res) => {
  const products = readProducts();

  const id = Number(req.params.id);

  const filteredProducts = products.filter((p) => p.id !== id);

  if (filteredProducts.length === products.length) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  saveProducts(filteredProducts);

  res.json({
    message: "Product Deleted Successfully",
  });
});

module.exports = router;
