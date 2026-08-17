const express = require("express");
const router = express.Router();

const Store = require("../models/Store");

// =====================================================
// CREATE STORE
// POST /api/stores
// =====================================================

router.post("/", async (req, res) => {
  try {
    const { name, logo, type, longitude, latitude, user } = req.body;

    // Validation
    if (
      !name ||
      !type ||
      longitude === undefined ||
      latitude === undefined ||
      !user
    ) {
      return res.status(400).json({
        message: "Name, type, longitude, latitude and user are required",
      });
    }

    // Create new store
    const store = new Store({
      name,
      logo,
      type,

      location: {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)],
      },

      user,
    });

    // Save store
    const savedStore = await store.save();

    res.status(201).json({
      message: "Store created successfully",
      store: savedStore,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// =====================================================
// GET ALL STORES
// GET /api/stores
// =====================================================

router.get("/", async (req, res) => {
  try {
    const stores = await Store.find().populate("user", "name email");

    res.status(200).json(stores);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// =====================================================
// SEARCH STORES WITHIN 1 KM
// POST /api/stores/nearby
// =====================================================

router.post("/nearby", async (req, res) => {
  try {
    const { latitude, longitude, name } = req.body;

    // Validate coordinates
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        message: "Latitude and longitude are required",
      });
    }

    // Convert coordinates to numbers
    const lat = Number(latitude);
    const lng = Number(longitude);

    // Check if coordinates are valid numbers
    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({
        message: "Latitude and longitude must be numbers",
      });
    }

    // Aggregation pipeline
    const stores = await Store.aggregate([
      // -------------------------------------------------
      // 1. Find stores near the given coordinates
      // -------------------------------------------------
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lng, lat],
          },

          key: "location",

          // Distance will be returned in meters
          distanceField: "distance",

          // 1 KM = 1000 meters
          maxDistance: 1000,

          spherical: true,
        },
      },

      // -------------------------------------------------
      // 2. Search by store name
      // -------------------------------------------------
      {
        $match: name
          ? {
              name: {
                $regex: name,
                $options: "i",
              },
            }
          : {},
      },

      // -------------------------------------------------
      // 3. Get User information
      // -------------------------------------------------
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },

      // -------------------------------------------------
      // 4. Convert user array into object
      // -------------------------------------------------
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },

      // -------------------------------------------------
      // 5. Convert distance from meters to kilometers
      // -------------------------------------------------
      {
        $addFields: {
          distanceInKM: {
            $divide: ["$distance", 1000],
          },
        },
      },

      // -------------------------------------------------
      // 6. Select the fields we want to return
      // -------------------------------------------------
      {
        $project: {
          name: 1,
          logo: 1,
          type: 1,
          location: 1,

          // Distance
          distance: 1,
          distanceInKM: 1,

          // User details
          "user._id": 1,
          "user.name": 1,
          "user.email": 1,
        },
      },
    ]);

    // Return results
    res.status(200).json({
      count: stores.length,
      stores: stores,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
});

// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;
