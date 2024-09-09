// controllers/usersController.js

// This file contains the controller functions that handle the HTTP requests.

// call the users db functions to handle the data actions
const db = require("../db/api/users");

// utility to trim leading and trailing whitespace
function trimUserData(user) {
  if (user.first_name) {
    user.first_name = user.first_name.trim();
  }
  if (user.last_name) {
    user.last_name = user.last_name.trim();
  }
  if (user.description) {
    user.description = user.description.trim();
  }
  return user;
}

// Handle creating a user
async function createUser(req, res) {
  try {
    const userData = trimUserData(req.body);
    const newUser = await db.createUser(userData);
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
    const userData = trimUserData(req.body);
    const updatedUser = await db.updateUser(req.params.id, userData);
    // use the response of the updateUser call to determine if the user exists
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ error: "User not found" });
    }
    // if there is no user or some other issue then it fails
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
}

async function deleteUser(req, res) {
  try {
    const deletedUser = await db.deleteUser(req.params.id);
    if (deletedUser) {
      res.status(200).json(deletedUser);
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
