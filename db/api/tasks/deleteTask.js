const queryRunner = require("../utils/queryRunner");
const getTaskById = require("./getTaskById");

/**
 * Deletes a task from the database by its ID, including its relationship with users.
 *
 * This function first checks if the task exists by fetching it from the database.
 * If the task exists, it proceeds to delete the user-task relationship in the `user_tasks` table
 * and then deletes the task from the `tasks` table.
 *
 * @param {number} id - The ID of the task to be deleted.
 * @returns {Promise<Object|null>} - A promise that resolves to a message object if deletion is successful,
 *                                    or `null` if no task was found with the given ID.
 * @throws {Error} - Throws an error if any database query fails.
 */
async function deleteTask(id) {
  // Debugging purposes
  console.log(`Attempting to delete task with ID: ${id}`);

  // SQL query to delete the task
  const query = `DELETE FROM tasks WHERE id = ?`;
  // SQL query to delete the user-task relationship
  const deleteUserTaskQuery = `DELETE FROM user_tasks WHERE task_id = ?`;

  try {
    // Fetch the task first to ensure it exists
    const task = await getTaskById(id);
    if (!task) {
      // Debugging purposes
      console.log(`No task found with ID: ${id}`);
      // Return null if task not found
      return null;
    }

    // Debugging purposes
    console.log(
      `Task found: ${JSON.stringify(task)}. Proceeding with deletion.`
    );

    // First, delete the user-task relationship using queryRunner

    // Debugging purposes
    console.log(`Deleting user-task relationships for task ID: ${id}`);
    await queryRunner(deleteUserTaskQuery, [id]);
    // Debugging purposes
    console.log(`User-task relationship deleted for task ID: ${id}`);

    // Then, delete the task itself using queryRunner

    // Debugging purposes
    console.log(`Deleting task with ID: ${id}`);
    await queryRunner(query, [id]);
    // Debugging purposes
    console.log(`Task with ID: ${id} deleted successfully.`);

    // Successfully deleted
    return true;
  } catch (err) {
    // Handle any errors
    console.error(`Error in deleteTask function: ${err.message}`);
    throw err;
  }
}

module.exports = deleteTask;
