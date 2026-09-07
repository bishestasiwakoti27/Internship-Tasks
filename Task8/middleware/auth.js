const bcrypt = require("bcryptjs");
const User = require("../models/User");

const basicAuth = async (req, res, next) => {
  try {
    // Get Authorization header
    const authHeader = req.headers.authorization;

    // Check if Basic Authentication was provided
    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return res.status(401).json({
        message: "Basic authentication required",
      });
    }

    // Extract Base64 encoded credentials
    const base64Credentials = authHeader.split(" ")[1];

    // Decode Base64
    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "utf8",
    );

    // Split username and password
    const [username, password] = credentials.split(":");

    // Validate credentials format
    if (!username || !password) {
      return res.status(401).json({
        message: "Invalid authentication credentials",
      });
    }

    // Find user in MongoDB
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    // Compare entered password with hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    // Store authenticated user in request
    req.user = user;

    // Continue to protected route
    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = basicAuth;
