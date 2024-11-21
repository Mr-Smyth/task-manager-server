const dbCreateUser = require("../db/api/users/createUser");
const dbGetAllUsers = require("../db/api/users/getAllUsers");
const dbUpdateUser = require("../db/api/users/updateUser");
const dbDeleteUser = require("../db/api/users/deleteUser");

/**
 * Handles the creation of a new user.
 *
 * Expects the request body to contain the user data, such as `first_name`, `last_name`, and `description`.
 * Creates a user using the provided data and returns the newly created user.
 *
 * @param {Object} req - The request object, containing the user data in req.body.
 * @param {Object} res - The response object, used to send the HTTP response.
 * @returns {Object} A JSON response containing the created user or an error message.
 */
async function createUser(req, res) {
  try {
    // Destructure the necessary fields from the request body
    const { first_name, last_name, description } = req.body;

    // Make sure the required fields are provided
    if (!first_name || !last_name || !description) {
      return res
        .status(400)
        .json({ error: "First name, last name, and description are required" });
    }

    // Create a new user with the sanitized and validated data from the request body
    const newUser = await dbCreateUser({ first_name, last_name, description });

    // Return the created user with status 201 (Created)
    res.status(201).json(newUser);
  } catch (error) {
    // Handle any errors that occur during user creation
    console.error("Error creating user:", error.stack);
    res.status(500).json({ error: "Failed to create user" });
  }
}

/**
 * Retrieves all users from the database.
 *
 * This function fetches the list of all users and returns them in the response.
 *
 * @param {Object} req - The request object (not used here, but part of the signature).
 * @param {Object} res - The response object, used to send the list of users or an error message.
 * @returns {Object} A JSON response containing a list of users or an error message.
 */
async function getAllUsers(req, res) {
  try {
    // Fetch all users from the database
    const users = await dbGetAllUsers();
    // Return the users with status 200 (OK)
    res.status(200).json({ users });
  } catch (error) {
    // Handle any errors that occur during the retrieval of users
    console.error("Error occurred while fetching users:", error);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
}

/**
 * Handles the update of an existing user.
 *
 * Expects the user ID as a parameter in the URL and the user data (first_name, last_name, description) in the request body.
 * Attempts to update the user with the provided ID and data.
 *
 * @param {Object} req - The request object, containing the user ID in req.params.id and the user data in req.body.
 * @param {Object} res - The response object, used to send the updated user or an error message.
 * @returns {Object} A JSON response containing the updated user or an error message.
 */
async function updateUser(req, res) {
  try {
    // Destructure the necessary fields from the request body
    const { first_name, last_name, description } = req.body;

    // Prepare the updates object with the available fields
    const userUpdates = {};

    if (first_name) userUpdates.first_name = first_name;
    if (last_name) userUpdates.last_name = last_name;
    if (description) userUpdates.description = description;

    // If no valid fields are provided, return a 400 error
    if (Object.keys(userUpdates).length === 0) {
      return res
        .status(400)
        .json({
          error:
            "At least one field (first_name, last_name, description) must be provided",
        });
    }

    // Call the database function to update the user
    const updatedUser = await dbUpdateUser(req.params.id, userUpdates);

    if (updatedUser) {
      // Return the updated user with status 200 (OK)
      res.status(200).json(updatedUser);
    } else {
      // User not found, return 404 error
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error updating user:", error.stack);
    // Handle any errors that occur during user update
    res.status(500).json({ error: "Failed to update user" });
  }
}

/**
 * Handles the deletion of a user.
 *
 * Expects the user ID as a parameter in the URL.
 * Attempts to delete the user with the provided ID and returns a success response or an error message.
 *
 * @param {Object} req - The request object, containing the user ID in req.params.id.
 * @param {Object} res - The response object, used to send a success response or an error message.
 * @returns {Object} A JSON response indicating the success or failure of the deletion.
 */
async function deleteUser(req, res) {
  try {
    // Pass the user ID to the database handler for deletion
    const deletedUser = await dbDeleteUser(req.params.id);

    if (deletedUser) {
      // Return status 204 (No Content) for successful deletion
      res.status(204).send();
    } else {
      // User not found, return 404 error
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    // Handle any errors that occur during user deletion
    console.error("Error deleting user:", error.stack);
    res.status(500).json({ error: "Failed to delete user" });
  }
}

// Export the controller functions
module.exports = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
