const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Task 7: Store Logo
    logo: {
      url: {
        type: String,
        default: "",
      },

      public_id: {
        type: String,
        default: "",
      },
    },

    type: {
      type: String,
      required: true,
      enum: ["Electronics", "Grocery", "Clothing", "Stationery"],
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },

      coordinates: {
        type: [Number],
        required: true,
      },
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// IMPORTANT:
// Create 2dsphere index for location searching

storeSchema.index({
  location: "2dsphere",
});

module.exports = mongoose.model("Store", storeSchema);
