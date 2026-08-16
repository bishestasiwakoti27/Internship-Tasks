const jwtAuth = require("../middleware/jwtAuth");
const express = require("express");
const router = express.Router();

const Product = require("../models/Product");

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all products
 *       401:
 *         description: JWT token required
 *       500:
 *         description: Server error
 */
router.get("/", jwtAuth, async (req, res) => {
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
/**
 * @swagger
 * /products/search:
 *   get:
 *     summary: Search products
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         required: true
 *         schema:
 *           type: string
 *         example: cotton
 *     responses:
 *       200:
 *         description: Matching products
 *       401:
 *         description: JWT token required
 *       500:
 *         description: Server error
 */
router.get("/search", jwtAuth, async (req, res) => {
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

/**
 * @swagger
 * /products/filter/type:
 *   get:
 *     summary: Filter products by type
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: product_type
 *         required: true
 *         schema:
 *           type: string
 *         example: Shirt
 *     responses:
 *       200:
 *         description: Filtered products
 *       401:
 *         description: JWT token required
 *       500:
 *         description: Server error
 */
router.get("/filter/type", jwtAuth, async (req, res) => {
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

/**
 * @swagger
 * /products/sort/price:
 *   get:
 *     summary: Sort products by price
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: order
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *         example: asc
 *     responses:
 *       200:
 *         description: Products sorted by price
 *       401:
 *         description: JWT token required
 *       500:
 *         description: Server error
 */
router.get("/sort/price", jwtAuth, async (req, res) => {
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

/**
 * @swagger
 * /products/out-of-stock:
 *   get:
 *     summary: Get low stock products
 *     description: Returns products with quantity less than 5.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of low stock products
 *       401:
 *         description: JWT token required
 *       500:
 *         description: Server error
 */
router.get("/out-of-stock", jwtAuth, async (req, res) => {
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

/**
 * @swagger
 * /products/stats/count:
 *   get:
 *     summary: Get total product count
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total number of products
 *       401:
 *         description: JWT token required
 *       500:
 *         description: Server error
 */
router.get("/stats/count", jwtAuth, async (req, res) => {
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

/**
 * @swagger
 * /products/stats/average-price:
 *   get:
 *     summary: Get average product price
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Average price of products
 *       401:
 *         description: JWT token required
 *       500:
 *         description: Server error
 */
router.get("/stats/average-price", jwtAuth, async (req, res) => {
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

/**
 * @swagger
 * /products/stats/total-quantity:
 *   get:
 *     summary: Get total product quantity
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total quantity of products
 *       401:
 *         description: JWT token required
 *       500:
 *         description: Server error
 */
router.get("/stats/total-quantity", jwtAuth, async (req, res) => {
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

/**
 * @swagger
 * /products/stats/group-by-type:
 *   get:
 *     summary: Group products by type
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products grouped by type
 *       401:
 *         description: JWT token required
 *       500:
 *         description: Server error
 */
router.get("/stats/group-by-type", jwtAuth, async (req, res) => {
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

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product found
 *       401:
 *         description: JWT token required
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.get("/:id", jwtAuth, async (req, res) => {
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

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - quantity
 *               - product_type
 *             properties:
 *               name:
 *                 type: string
 *                 example: Cotton Shirt
 *               price:
 *                 type: number
 *                 example: 1500
 *               description:
 *                 type: string
 *                 example: Premium cotton shirt
 *               quantity:
 *                 type: number
 *                 example: 10
 *               product_type:
 *                 type: string
 *                 example: Shirt
 *               image:
 *                 type: string
 *                 example: shirt.jpg
 *               store:
 *                 type: string
 *                 example: 64f123456789abcdef123456
 *     responses:
 *       201:
 *         description: Product created successfully
 *       401:
 *         description: JWT token required
 *       400:
 *         description: Invalid product data
 */
router.post("/", jwtAuth, async (req, res) => {
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

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - quantity
 *               - product_type
 *             properties:
 *               name:
 *                 type: string
 *                 example: Cotton Shirt
 *               price:
 *                 type: number
 *                 example: 1500
 *               description:
 *                 type: string
 *                 example: Premium cotton shirt
 *               quantity:
 *                 type: number
 *                 example: 10
 *               product_type:
 *                 type: string
 *                 example: Shirt
 *               image:
 *                 type: string
 *                 example: shirt.jpg
 *               store:
 *                 type: string
 *                 example: 64f123456789abcdef123456
 *     responses:
 *       201:
 *         description: Product created successfully
 *       401:
 *         description: JWT token required
 *       400:
 *         description: Invalid product data
 */
router.put("/:id", jwtAuth, async (req, res) => {
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
router.patch("/:id/quantity", jwtAuth, async (req, res) => {
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
router.patch("/:id", jwtAuth, async (req, res) => {
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

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: JWT token required
 *       404:
 *         description: Product not found
 */
router.delete("/:id", jwtAuth, async (req, res) => {
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
