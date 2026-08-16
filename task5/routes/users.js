const transporter = require("../config/email");
const express = require("express");
const router = express.Router();

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const basicAuth = require("../middleware/auth");
const jwtAuth = require("../middleware/jwtAuth");

// =====================================================
// GET ALL USERS
// GET /users
// =====================================================

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: JWT token required
 *       500:
 *         description: Server error
 */

router.get("/", jwtAuth, async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// =====================================================
// BASIC AUTHENTICATION TEST
// GET /users/profile
// =====================================================

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile using Basic Authentication
 *     tags:
 *       - Users
 *     security:
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: Basic authentication successful
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Server error
 */

router.get("/profile", basicAuth, async (req, res) => {
  try {
    res.json({
      message: "Basic authentication successful",
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        username: req.user.username,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// =====================================================
// USER LOGIN
// POST /users/login
// =====================================================

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login user and generate JWT token
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: testuser
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Username and password are required
 *       401:
 *         description: Invalid username or password
 *       500:
 *         description: Server error
 */

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    // Compare password with hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// =====================================================
// JWT PROTECTED PROFILE
// GET /users/jwt-profile
// =====================================================

/**
 * @swagger
 * /users/jwt-profile:
 *   get:
 *     summary: Get profile using JWT authentication
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: JWT authentication successful
 *       401:
 *         description: JWT token required or invalid
 */

router.get("/jwt-profile", jwtAuth, async (req, res) => {
  try {
    res.json({
      message: "JWT authentication successful",
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// =====================================================
// GET USER BY ID
// GET /users/:id
// =====================================================

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *       401:
 *         description: JWT token required
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

router.get("/:id", jwtAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// =====================================================
// CREATE USER
// POST /users
// =====================================================

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - username
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Bishesta
 *               email:
 *                 type: string
 *                 example: bishesta@example.com
 *               username:
 *                 type: string
 *                 example: bishesta123
 *               password:
 *                 type: string
 *                 example: password123
 *               image:
 *                 type: string
 *                 example: ""
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Username or email already exists
 *       500:
 *         description: Server error
 */

router.post("/", async (req, res) => {
  try {
    const { name, email, username, password, image } = req.body;

    // Validate required fields
    if (!name || !email || !username || !password) {
      return res.status(400).json({
        message: "Name, email, username and password are required",
      });
    }

    // Check username
    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    // Check email
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      username,
      password: hashedPassword,
      image,
    });

    // Never return password
    res.status(201).json({
      message: "User Created Successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        image: user.image,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// =====================================================
// UPDATE USER
// PUT /users/:id
// =====================================================

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: JWT token required
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

router.put("/:id", jwtAuth, async (req, res) => {
  try {
    const { name, email, username, password, image } = req.body;

    const updateData = {
      name,
      email,
      username,
      image,
    };

    // Hash new password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User Updated Successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// =====================================================
// PARTIAL UPDATE USER
// PATCH /users/:id
// =====================================================

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Partially update a user
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: JWT token required
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

router.patch("/:id", jwtAuth, async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Hash password if it is being changed
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User Updated Successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// =====================================================
// DELETE USER
// DELETE /users/:id
// =====================================================

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: JWT token required
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

router.delete("/:id", jwtAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
//
// TEST EMAIL
// POST /users/test-email
//
router.post("/test-email", jwtAuth, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Shopping API Test Email",
      text: "Your Shopping API email system is working successfully!",
    });

    res.json({
      message: "Email sent successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
});
module.exports = router;
