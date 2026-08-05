const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const pool = require("./config/db");

app.use(express.json());

const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");

app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("Shopping API with PostgreSQL Running");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
