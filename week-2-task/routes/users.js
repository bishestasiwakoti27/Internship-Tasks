const express = require("express");
const router = express.Router();

const pool = require("../config/db");

//
// GET ALL USERS
//
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id");

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

//
// GET USER BY ID
//
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

//
// CREATE USER
//
router.post("/", async (req, res) => {
  try {
    const { name, email, age, address } = req.body;

    const result = await pool.query(
      `INSERT INTO users (name, email, age, address)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, email, age, address],
    );

    res.status(201).json({
      message: "User Created Successfully",
      user: result.rows[0],
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

//
// UPDATE USER (PUT)
//
router.put("/:id", async (req, res) => {
  try {
    const { name, email, age, address } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET name=$1, email=$2, age=$3, address=$4
       WHERE id=$5
       RETURNING *`,
      [name, email, age, address, req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User Updated Successfully",
      user: result.rows[0],
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

//
// DELETE USER
//
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id=$1 RETURNING *",
      [req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;
