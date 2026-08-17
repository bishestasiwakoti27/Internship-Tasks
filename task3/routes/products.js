const express = require("express");
const router = express.Router();

const Product = require("../models/Product");

//
// GET ALL PRODUCTS
//
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

//
// SEARCH PRODUCTS
//
router.get("/search", async (req, res) => {
  try {
    const search = req.query.search;

    const products = await Product.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    });

    res.json(products);
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
    const products = await Product.find({
      product_type: req.query.product_type,
    });

    res.json(products);
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
    const order = req.query.order === "desc" ? -1 : 1;

    const products = await Product.find().sort({
      price: order,
    });

    res.json(products);
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
    const products = await Product.find({
      quantity: { $lt: 5 },
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
//
// GET OUT OF STOCK PRODUCTS
//
router.get("/out-of-stock", async (req, res) => {
  try {
    const products = await Product.find({
      quantity: { $lt: 5 },
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
//
// GET PRODUCT BY ID
//
//
// TOTAL PRODUCTS
//
router.get("/stats/count", async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    res.json({
      totalProducts,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
//
// AVERAGE PRICE
//
router.get("/stats/average-price", async (req, res) => {
  try {
    const result = await Product.aggregate([
      {
        $group: {
          _id: null,
          averagePrice: {
            $avg: "$price",
          },
        },
      },
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
//
// TOTAL QUANTITY
//
router.get("/stats/total-quantity", async (req, res) => {
  try {
    const result = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalQuantity: {
            $sum: "$quantity",
          },
        },
      },
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
//
// GROUP PRODUCTS BY TYPE
//
router.get("/stats/group-by-type", async (req, res) => {
  try {
    const result = await Product.aggregate([
      {
        $group: {
          _id: "$product_type",
          totalProducts: {
            $sum: 1,
          },
        },
      },
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

//
// CREATE PRODUCT
//
router.post("/", async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      quantity: req.body.quantity,
      product_type: req.body.product_type,
    });

    const savedProduct = await product.save();

    res.status(201).json({
      message: "Product Added Successfully",
      product: savedProduct,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

//
// UPDATE PRODUCT (PUT)
//
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        quantity: req.body.quantity,
        product_type: req.body.product_type,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product Updated Successfully",
      product: updatedProduct,
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
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        quantity: req.body.quantity,
      },
      {
        new: true,
      },
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Quantity Updated Successfully",
      product,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

//
// PARTIAL UPDATE PRODUCT (PATCH)
//
router.patch("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product Updated Successfully",
      product,
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
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
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
