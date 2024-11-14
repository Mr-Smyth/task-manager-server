const queryRunner = require("../utils/queryRunner");

/**
 * Assigns a user to a task in the database.
 *
 * @param {number} userId - The ID of the user to be assigned.
 * @param {number} taskId - The ID of the task to which the user will be assigned.
 * @throws {Error} Throws an error if the database query fails.
 * @returns {Promise} - Resolves if the operation is successful.
 */
async function assignUserToTask(userId, taskId) {
  try {
    // debugging purposes
    console.log(`Assigning user ${userId} to task ${taskId}`);

    const query = `INSERT OR REPLACE INTO user_tasks (user_id, task_id) VALUES (?, ?)`;
    const params = [userId, taskId];

    // Run the database query
    await queryRunner(query, params);

    // debugging purposes
    console.log(`User ${userId} assigned to task ${taskId}`);
  } catch (error) {
    // Handle errors
    console.error(`Error assigning user ${userId} to task ${taskId}:`,error.message);
    throw new Error(`Failed to assign user to task: ${error.message}`);
  }
}

module.exports = assignUserToTask;
