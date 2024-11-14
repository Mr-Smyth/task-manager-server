const queryRunner = require("../utils/queryRunner");

/**
 * Retrieves the user assigned to a specific task by its ID.
 *
 * This function queries the database to find the user linked to a task.
 * It checks the `user_tasks` table where the `task_id` is linked to a `user_id`.
 * If a user is assigned, it returns the `user_id`. If no user is assigned, it returns null.
 *
 * @param {number} id - The task ID for which to retrieve the assigned user.
 * @returns {Promise<number|null>} A promise that resolves to the assigned user's ID if a user is found,
 *                                or null if no user is assigned to the task.
 * @throws {Error} If an error occurs while querying the database.
 */
async function getAssignedUser(id) {
  // SQL query to get the user_id associated with the given task_id
  const query = `SELECT user_id FROM user_tasks WHERE task_id = ?`;

  try {
    // Use queryRunner to fetch the user linked to the task
    const user = await queryRunner(query, [id]);

    // Check if the result is empty (no user assigned to the task)
    if (!user || user.length === 0) {
      // Return null if no user is assigned
      return null;
      // debugging purposes
      console.log(`No user assigned to task ${id}`);
    }

    // Return the user_id from the first result

    // debugging purposes
    console.log(`Retrieved user: ${user[0].user_id}`);
    // Return the user ID
    return user[0].user_id;
  } catch (err) {
    // Handle any errors
    console.error(
      `Failed to retrieve user linked with task_id ${id}: ${err.message}`
    );
    throw err;
  }
}

module.exports = getAssignedUser;
