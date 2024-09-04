// controllers/usersController.js

// This file contains the controller functions that handle the HTTP requests.

// call the users db functions to handle the data actions
const db = require("../db/api/users");

async function createUser(req, res) {
  try {
    const userData = req.body;
    const newUser = await db.createUser(userData);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await db.getAllUsers();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve users" });
  }
}

async function updateUser(req, res) {
  // test response
  res.json({"message": "In updateUsers"})
}

async function deleteUser(req, res) {
  // test response
  res.json({"message": "In deleteUser"})
}

module.exports = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
