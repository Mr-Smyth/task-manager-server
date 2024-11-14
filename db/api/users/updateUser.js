const queryRunner = require("../utils/queryRunner");
const getUserById = require("./getUserById");

/**
 * Updates a user's details in the database based on the provided updates.
 *
 * @param {number} id - The ID of the user to be updated.
 * @param {Object} userUpdates - An object containing the user details to be updated.
 * @param {string} [userUpdates.first_name] - The updated first name of the user (optional).
 * @param {string} [userUpdates.last_name] - The updated last name of the user (optional).
 * @param {string} [userUpdates.description] - The updated description of the user (optional).
 *
 * @returns {Object|null} - Returns the updated user object if successful, or null if no updates are provided.
 *
 * @throws {Error} - Throws an error if the update query or retrieval of the updated user fails.
 */
async function updateUser(id, userUpdates) {
  // Array to store the SQL field update statements (e.g., "first_name = ?")
  const fields = [];
  // Array to store the values corresponding to the placeholders in the SQL query
  const params = [];

  // Check if first_name is provided in the userUpdates and add it to the query
  if (userUpdates.first_name) {
    fields.push("first_name = ?");
    params.push(userUpdates.first_name);
  }

  // Check if last_name is provided in the userUpdates and add it to the query
  if (userUpdates.last_name) {
    fields.push("last_name = ?");
    params.push(userUpdates.last_name);
  }

  // Check if description is provided in the userUpdates and add it to the query
  if (userUpdates.description) {
    fields.push("description = ?");
    params.push(userUpdates.description);
  }

  // If no fields were provided to update, return null early
  if (fields.length === 0) {
    return null;
  }

  // Construct the SQL UPDATE query
  const query = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
  // Add the user ID to the parameters array
  params.push(id);

  try {
    // Execute the query using queryRunner to update the user
    await queryRunner(query, params);

    // After updating, fetch and return the updated user details
    return await getUserById(id);
  } catch (err) {
    // Handle any errors
    throw new Error(`Failed to update user with id ${id}: ${err.message}`);
  }
}

module.exports = updateUser;
