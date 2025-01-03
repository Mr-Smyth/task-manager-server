// routes/users.js

// This file sets up the routes and applies the validation middleware.

const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const {validateUser, validateUpdateUser} = require('../middleware/userValidators');


// Route for creating a user
router.post('/', validateUser, usersController.createUser);

// Route for getting all users
router.get('/', usersController.getAllUsers);

// Route for updating a user with PATCH (partial update)
router.patch('/:id', validateUpdateUser, usersController.updateUser);

// Route for updating a user with PUT (full update)
router.put('/:id', validateUser, usersController.updateUser);

// Route for deleting a user
router.delete('/:id', usersController.deleteUser);

module.exports = router;
