const queryRunner = require("../utils/queryRunner");
const getUserById = require("./getUserById");

/**
 * Deletes a user from the database along with disassociating their tasks.
 *
 * This function checks if the user exists by calling `getUserById` with the provided user ID.
 * If the user exists, it will first disassociate the user from any tasks they are assigned to by
 * updating the `user_tasks` table. Then, it will delete the user from the `users` table.
 *
 * If the user does not exist, it returns `null`.
 *
 * @param {number} id - The ID of the user to delete.
 * @returns {Object|null} - A success message if the user and task associations were deleted,
 *                          or `null` if the user does not exist.
 * @throws {Error} - Throws an error if there is an issue with the database operations.
 */
async function deleteUser(id) {
  try {
    // First, check if the user exists by calling getUserById
    const user = await getUserById(id);
    if (!user) {
      // Return null if the user does not exist
      return null;
    }

    // SQL query to disassociate the user from any tasks they are assigned to
    const queryDisassociateTasks = `UPDATE user_tasks SET user_id = NULL WHERE user_id = ?`;
    const params = [id];

    // Execute the disassociation query
    await queryRunner(queryDisassociateTasks, params);

    // SQL query to delete the user from the 'users' table
    const queryDeleteUser = `DELETE FROM users WHERE id = ?`;
    await queryRunner(queryDeleteUser, params);

    // Return a success message upon successful deletion and disassociation
    return {
      message: "User and task associations deleted successfully",
    };
  } catch (err) {
    // Handle any errors
    throw new Error(`Failed to delete user with id ${id}: ${err.message}`);
  }
}

module.exports = deleteUser;
