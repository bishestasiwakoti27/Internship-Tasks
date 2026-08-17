const express = require("express");
const router = express.Router();

const pool = require("../config/db");

//
// GET ALL PRODUCTS
//
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//
// SEARCH PRODUCTS
//
router.get("/search", async (req, res) => {
  try {
    const { search } = req.query;

    const result = await pool.query(
      `SELECT * FROM products
       WHERE LOWER(name) LIKE LOWER($1)
       OR LOWER(description) LIKE LOWER($1)`,
      [`%${search}%`],
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
//
// FILTER PRODUCTS BY TYPE
//
router.get("/filter/type", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products WHERE product_type = $1",
      [req.query.product_type],
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
//
// SORT PRODUCTS BY PRICE
//
router.get("/sort/price", async (req, res) => {
  try {
    const order = req.query.order === "desc" ? "DESC" : "ASC";

    const result = await pool.query(
      `SELECT * FROM products ORDER BY price ${order}`,
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
//
// OUT OF STOCK PRODUCTS
//
router.get("/out-of-stock", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products WHERE quantity < 5",
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
//
// COUNT TOTAL PRODUCTS
//
router.get("/count", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) AS total_products FROM products",
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
//
// TOTAL QUANTITY OF PRODUCTS
//
router.get("/total-quantity", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT SUM(quantity) AS total_quantity FROM products",
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
//
// AVERAGE PRODUCT PRICE
//
router.get("/average-price", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT AVG(price) AS average_price FROM products",
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
//
// GROUP PRODUCTS BY TYPE
//
router.get("/group/type", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT product_type, COUNT(*) AS total_products
      FROM products
      GROUP BY product_type
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
//
// GET PRODUCT BY ID
//
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//
// CREATE PRODUCT
//
router.post("/", async (req, res) => {
  try {
    const { name, price, description, quantity, product_type } = req.body;

    const result = await pool.query(
      `INSERT INTO products
      (name, price, description, quantity, product_type)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [name, price, description, quantity, product_type],
    );

    res.status(201).json({
      message: "Product Added Successfully",
      product: result.rows[0],
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

//
// UPDATE PRODUCT
//
router.put("/:id", async (req, res) => {
  try {
    const { name, price, description, quantity, product_type } = req.body;

    const result = await pool.query(
      `UPDATE products
       SET name=$1,
           price=$2,
           description=$3,
           quantity=$4,
           product_type=$5
       WHERE id=$6
       RETURNING *`,
      [name, price, description, quantity, product_type, req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product Updated Successfully",
      product: result.rows[0],
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});
//
// UPDATE PRODUCT QUANTITY
//
router.patch("/:id/quantity", async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE products
       SET quantity = $1
       WHERE id = $2
       RETURNING *`,
      [req.body.quantity, req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Quantity Updated Successfully",
      product: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

//
// DELETE PRODUCT
//
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM products WHERE id=$1 RETURNING *",
      [req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;
