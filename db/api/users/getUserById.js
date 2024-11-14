const queryRunner = require("../utils/queryRunner");

/**
 * Retrieves a user from the database by their ID.
 *
 * This function executes a SQL query to fetch user data from the 'users' table where
 * the user's ID matches the provided one. It returns the first user found or throws an error
 * if the query fails.
 *
 * @param {number|string} id - The unique identifier of the user to retrieve.
 * The ID is used to query the database for the corresponding user.
 * @returns {Object|null} The user object if found, or null if no user exists with the provided ID.
 * @throws {Error} If the query fails or if the database operation encounters an issue.
 *
 * @example
 * const user = await getUserById(1);
 * console.log(user); // Logs the user data if found, or throws an error if not.
 */
async function getUserById(id) {
  const query = `SELECT * FROM users WHERE id = ?`;
  const params = [id];

  try {
    // Execute the query using queryRunner
    const row = await queryRunner(query, params);
    // Return the first user found in the result set
    return row[0];
  } catch (err) {
    // Handle any errors
    throw new Error(`Failed to retrieve user with id ${id}: ${err.message}`);
  }
}

module.exports = getUserById;
