// controllers/usersController.js

// This file contains the controller functions that handle the HTTP requests for users.

// call the users db functions to handle the data actions
const db = require("../db/api/users");

// Handle creating a user
async function createUser(req, res) {
  try {
    const newUser = await db.createUser(req.body);  // req.body is already validated and trimmed by middleware
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
}

// Handle Getting all users
async function getAllUsers(req, res) {
  try {
    const users = await db.getAllUsers();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve users" });
  }
}

// Handle updating a user
async function updateUser(req, res) {
  try {
    console.log("req.body: ", req.body);
    const updatedUser = await db.updateUser(req.params.id, req.body);  // req.body is already validated and trimmed by middleware
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
}

// Handle deleting a user
async function deleteUser(req, res) {
  try {
    const deletedUser = await db.deleteUser(req.params.id);
    if (deletedUser) {
      res.status(204).json(deletedUser);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
}

module.exports = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
