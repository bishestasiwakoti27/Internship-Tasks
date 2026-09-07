const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    quantity: {
      type: Number,
      required: true,
    },

    product_type: {
      type: String,
      required: true,
    },

    // Task 4: Product Image
    image: {
      type: String,
      default: "",
    },

    // Task 4: Product belongs to Store
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Product", productSchema);
