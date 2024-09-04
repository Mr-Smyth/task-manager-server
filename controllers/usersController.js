// controllers/usersController.js

// This file contains the controller functions that handle the HTTP requests.

async function createUser(req, res) {
  // test response
  res.json({"message": "In createUser"})
}

async function getAllUsers(req, res) {
  // test response
  res.json({"message": "In getAllUsers"})
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
