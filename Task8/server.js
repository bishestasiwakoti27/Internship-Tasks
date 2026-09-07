require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();
const helmet = require("helmet");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
connectDB();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(mongoSanitize());

app.use(express.json());
const path = require("path");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const storeRoutes = require("./routes/storeRoutes");

app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/stores", storeRoutes);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("Shopping API with MongoDB Running");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
