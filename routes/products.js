const jwtAuth = require("../middleware/jwtAuth");
const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const Store = require("../models/Store");

const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");

/**
 * =========================================================
 * GET ALL PRODUCTS
 * GET /products
 * =========================================================
 */
router.get("/", jwtAuth, async (req, res) => {
  try {
    const products = await Product.find().populate(
      "store",
      "name logo type location",
    );

    res.json(products);
  } catch (err) {
    console.error("GET PRODUCTS ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

/**
 * =========================================================
 * SEARCH PRODUCTS
 * GET /products/search?search=cotton
 * =========================================================
 */
router.get("/search", jwtAuth, async (req, res) => {
  try {
    const search = req.query.search;

    if (!search) {
      return res.status(400).json({
        message: "Search keyword is required",
      });
    }

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
    console.error("SEARCH PRODUCTS ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

/**
 * =========================================================
 * FILTER PRODUCTS BY TYPE
 * GET /products/filter/type?product_type=Shirt
 * =========================================================
 */
router.get("/filter/type", jwtAuth, async (req, res) => {
  try {
    const productType = req.query.product_type;

    if (!productType) {
      return res.status(400).json({
        message: "product_type is required",
      });
    }

    const products = await Product.find({
      product_type: productType,
    }).populate("store", "name logo type location");

    res.json(products);
  } catch (err) {
    console.error("FILTER PRODUCTS ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

/**
 * =========================================================
 * SORT PRODUCTS BY PRICE
 * GET /products/sort/price?order=asc
 * =========================================================
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
    console.error("SORT PRODUCTS ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

/**
 * =========================================================
 * GET LOW STOCK PRODUCTS
 * GET /products/out-of-stock
 * =========================================================
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
    console.error("LOW STOCK PRODUCTS ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

/**
 * =========================================================
 * TOTAL PRODUCT COUNT
 * GET /products/stats/count
 * =========================================================
 */
router.get("/stats/count", jwtAuth, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    res.json({
      totalProducts,
    });
  } catch (err) {
    console.error("PRODUCT COUNT ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

/**
 * =========================================================
 * AVERAGE PRODUCT PRICE
 * GET /products/stats/average-price
 * =========================================================
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
    console.error("AVERAGE PRICE ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

/**
 * =========================================================
 * TOTAL PRODUCT QUANTITY
 * GET /products/stats/total-quantity
 * =========================================================
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
    console.error("TOTAL QUANTITY ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

/**
 * =========================================================
 * GROUP PRODUCTS BY TYPE
 * GET /products/stats/group-by-type
 * =========================================================
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
    console.error("GROUP BY TYPE ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

/**
 * =========================================================
 * GET PRODUCT BY ID
 * GET /products/:id
 * =========================================================
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
    console.error("GET PRODUCT BY ID ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

/**
 * =========================================================
 * CREATE PRODUCT
 * POST /products
 *
 * Content-Type:
 * multipart/form-data
 * =========================================================
 */
router.post("/", jwtAuth, upload.array("images", 5), async (req, res) => {
  try {
    console.log("========== CREATE PRODUCT ==========");
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);
    console.log("USER:", req.user);

    /**
     * Make sure request body exists
     */
    if (!req.body) {
      return res.status(400).json({
        message: "Request body is missing",
      });
    }

    /**
     * Required fields
     */
    const { name, price, description, quantity, product_type, store } =
      req.body;

    if (!name) {
      return res.status(400).json({
        message: "Product name is required",
      });
    }

    if (!price) {
      return res.status(400).json({
        message: "Product price is required",
      });
    }

    if (quantity === undefined || quantity === "") {
      return res.status(400).json({
        message: "Product quantity is required",
      });
    }

    if (!product_type) {
      return res.status(400).json({
        message: "Product type is required",
      });
    }

    if (!store) {
      return res.status(400).json({
        message: "Store ID is required",
      });
    }

    /**
     * Check whether store exists
     */
    const storeExists = await Store.findById(store);

    if (!storeExists) {
      return res.status(404).json({
        message: "Store not found",
      });
    }

    /**
     * Upload images information
     */
    const images = (req.files || []).map((file, index) => ({
      url: file.path,
      public_id: file.filename,
      isPrimary: index === 0,
    }));

    /**
     * Create product
     */
    const product = new Product({
      name,
      price,
      description,
      quantity,
      product_type,
      images,
      store,
    });

    /**
     * Save product
     */
    const savedProduct = await product.save();

    /**
     * Populate store information
     */
    await savedProduct.populate("store", "name logo type location");

    console.log("PRODUCT CREATED:", savedProduct);

    res.status(201).json({
      message: "Product Added Successfully",
      product: savedProduct,
    });
  } catch (err) {
    console.error("========== PRODUCT ERROR ==========");
    console.error(err);
    console.error("REQUEST BODY:", req.body);
    console.error("FILES:", req.files);
    console.error("===================================");

    /**
     * Delete uploaded images if product creation fails
     */
    if (req.files && req.files.length > 0) {
      await Promise.all(
        req.files.map((file) => cloudinary.uploader.destroy(file.filename)),
      );
    }

    res.status(400).json({
      message: err.message,
    });
  }
});

/**
 * =========================================================
 * UPDATE PRODUCT
 * PUT /products/:id
 * =========================================================
 */
router.put("/:id", jwtAuth, upload.array("images", 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const oldImages = product.images || [];

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

    if (req.body.store !== undefined) {
      const storeExists = await Store.findById(req.body.store);

      if (!storeExists) {
        return res.status(404).json({
          message: "Store not found",
        });
      }

      product.store = req.body.store;
    }

    /**
     * Replace images if new images were uploaded
     */
    if (req.files && req.files.length > 0) {
      product.images = req.files.map((file, index) => ({
        url: file.path,
        public_id: file.filename,
        isPrimary: index === 0,
      }));
    }

    const updatedProduct = await product.save();

    /**
     * Delete old Cloudinary images
     */
    if (req.files && req.files.length > 0) {
      await Promise.all(
        oldImages
          .filter((image) => image.public_id)
          .map((image) => cloudinary.uploader.destroy(image.public_id)),
      );
    }

    await updatedProduct.populate("store", "name logo type location");

    res.json({
      message: "Product Updated Successfully",
      product: updatedProduct,
    });
  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);

    /**
     * Clean up newly uploaded images
     */
    if (req.files && req.files.length > 0) {
      await Promise.all(
        req.files.map((file) => cloudinary.uploader.destroy(file.filename)),
      );
    }

    res.status(400).json({
      message: err.message,
    });
  }
});

/**
 * =========================================================
 * UPDATE PRODUCT QUANTITY
 * PATCH /products/:id/quantity
 * =========================================================
 */
router.patch("/:id/quantity", jwtAuth, async (req, res) => {
  try {
    if (req.body.quantity === undefined) {
      return res.status(400).json({
        message: "Quantity is required",
      });
    }

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
    console.error("UPDATE QUANTITY ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

/**
 * =========================================================
 * PARTIAL UPDATE PRODUCT
 * PATCH /products/:id
 * =========================================================
 */
router.patch("/:id", jwtAuth, upload.array("images", 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

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

    if (req.body.store !== undefined) {
      const storeExists = await Store.findById(req.body.store);

      if (!storeExists) {
        return res.status(404).json({
          message: "Store not found",
        });
      }

      product.store = req.body.store;
    }

    const oldImages = product.images || [];

    /**
     * Replace images if uploaded
     */
    if (req.files && req.files.length > 0) {
      product.images = req.files.map((file, index) => ({
        url: file.path,
        public_id: file.filename,
        isPrimary: index === 0,
      }));
    }

    const updatedProduct = await product.save();

    /**
     * Delete old images
     */
    if (req.files && req.files.length > 0) {
      await Promise.all(
        oldImages
          .filter((image) => image.public_id)
          .map((image) => cloudinary.uploader.destroy(image.public_id)),
      );
    }

    await updatedProduct.populate("store", "name logo type location");

    res.json({
      message: "Product Updated Successfully",
      product: updatedProduct,
    });
  } catch (err) {
    console.error("PATCH PRODUCT ERROR:", err);

    if (req.files && req.files.length > 0) {
      await Promise.all(
        req.files.map((file) => cloudinary.uploader.destroy(file.filename)),
      );
    }

    res.status(400).json({
      message: err.message,
    });
  }
});

/**
 * =========================================================
 * DELETE PRODUCT
 * DELETE /products/:id
 * =========================================================
 */
router.delete("/:id", jwtAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    /**
     * Delete images from Cloudinary
     */
    if (product.images && product.images.length > 0) {
      await Promise.all(
        product.images
          .filter((image) => image.public_id)
          .map((image) => cloudinary.uploader.destroy(image.public_id)),
      );
    }

    /**
     * Delete product
     */
    await Product.findByIdAndDelete(req.params.id);

    res.json({
      message: "Product Deleted Successfully",
    });
  } catch (err) {
    console.error("DELETE PRODUCT ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

/**
 * =========================================================
 * MULTER ERROR HANDLER
 * =========================================================
 */
router.use((err, req, res, next) => {
  if (err instanceof require("multer").MulterError) {
    return res.status(400).json({
      message: err.message,
    });
  }

  if (err.message === "Only image files are allowed") {
    return res.status(400).json({
      message: err.message,
    });
  }

  next(err);
});

module.exports = router;
