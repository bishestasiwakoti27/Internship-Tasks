const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path");

// Path to users.json
const filePath = path.join(__dirname, "../users.json");

// Function to read users
function readUsers() {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

// Function to save users
function saveUsers(users) {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}

//
// GET ALL USERS
//
router.get("/", (req, res) => {
  const users = readUsers();
  res.json(users);
});

//
// GET USER BY ID
//
router.get("/:id", (req, res) => {
  const users = readUsers();

  const id = Number(req.params.id);

  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.json(user);
});

//
// CREATE USER
//
router.post("/", (req, res) => {
  const users = readUsers();

  const newUser = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email,
  };

  users.push(newUser);

  saveUsers(users);

  res.status(201).json({
    message: "User Added Successfully",
    user: newUser,
  });
});

//
// UPDATE USER (PUT)
//
router.put("/:id", (req, res) => {
  const users = readUsers();

  const id = Number(req.params.id);

  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  users[index] = {
    id: id,
    name: req.body.name,
    email: req.body.email,
  };

  saveUsers(users);

  res.json({
    message: "User Updated Successfully",
    user: users[index],
  });
});

//
// PARTIAL UPDATE (PATCH)
//
router.patch("/:id", (req, res) => {
  const users = readUsers();

  const id = Number(req.params.id);

  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  if (req.body.name) {
    user.name = req.body.name;
  }

  if (req.body.email) {
    user.email = req.body.email;
  }

  saveUsers(users);

  res.json({
    message: "User Updated Successfully",
    user,
  });
});

//
// DELETE USER
//
router.delete("/:id", (req, res) => {
  const users = readUsers();

  const id = Number(req.params.id);

  const filteredUsers = users.filter((u) => u.id !== id);

  if (filteredUsers.length === users.length) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  saveUsers(filteredUsers);

  res.json({
    message: "User Deleted Successfully",
  });
});

module.exports = router;
