const express = require("express");
const router = express.Router();

const Product = require("../models/Product");

//
// GET ALL PRODUCTS
// GET /products
//
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate(
      "store",
      "name logo type location",
    );

    res.json(products);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

//
// SEARCH PRODUCTS
// GET /products/search?search=cotton
//
router.get("/search", async (req, res) => {
  try {
    const search = req.query.search;

    const products = await Product.find({
      $or: [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    }).populate("store", "name logo type location");

    res.json(products);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

//
// FILTER PRODUCTS BY TYPE
// GET /products/filter/type?product_type=Shirt
//
router.get("/filter/type", async (req, res) => {
  try {
    const products = await Product.find({
      product_type: req.query.product_type,
    }).populate("store", "name logo type location");

    res.json(products);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

//
// SORT PRODUCTS BY PRICE
// GET /products/sort/price?order=asc
//
router.get("/sort/price", async (req, res) => {
  try {
    const order = req.query.order === "desc" ? -1 : 1;

    const products = await Product.find()
      .sort({
        price: order,
      })
      .populate("store", "name logo type location");

    res.json(products);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

//
// OUT OF STOCK / LOW STOCK PRODUCTS
// GET /products/out-of-stock
//
router.get("/out-of-stock", async (req, res) => {
  try {
    const products = await Product.find({
      quantity: {
        $lt: 5,
      },
    }).populate("store", "name logo type location");

    res.json(products);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

//
// TOTAL PRODUCTS
// GET /products/stats/count
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
// GET /products/stats/average-price
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
// GET /products/stats/total-quantity
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
// GET /products/stats/group-by-type
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

//
// GET PRODUCT BY ID
// GET /products/:id
//
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "store",
      "name logo type location",
    );

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
// POST /products
//
// Task 4 additions:
// image
// store
//
router.post("/", async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      quantity: req.body.quantity,
      product_type: req.body.product_type,

      // Task 4
      image: req.body.image,
      store: req.body.store,
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
// UPDATE PRODUCT
// PUT /products/:id
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

        // Task 4
        image: req.body.image,
        store: req.body.store,
      },
      {
        new: true,
        runValidators: true,
      },
    ).populate("store", "name logo type location");

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
// PATCH /products/:id/quantity
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
        runValidators: true,
      },
    ).populate("store", "name logo type location");

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
// PARTIAL UPDATE PRODUCT
// PATCH /products/:id
//
router.patch("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("store", "name logo type location");

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
// DELETE /products/:id
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
