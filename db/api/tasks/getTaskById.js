const queryRunner = require("../utils/queryRunner");

/**
 * Retrieves a task from the database by its ID.
 *
 * This function executes an SQL query to retrieve a task from the 'tasks' table using the provided task ID.
 * If the task is found, it returns the task data, otherwise, it throws an error.
 *
 * @param {number} id - The unique identifier of the task to retrieve.
 * @returns {Promise<Object>} The task data object retrieved from the database.
 * @throws {Error} If the query fails or if the task with the provided ID does not exist.
 */
async function getTaskById(id) {
  // Debugging Purposes
  console.log(`Retrieving task with ID: ${id}`);

  // SQL query to select the task by ID
  const query = `SELECT * FROM tasks WHERE id = ?`;

  try {
    // Use queryRunner to execute the query and fetch the task by ID
    const task = await queryRunner(query, [id]);

    // Debugging Purposes
    console.log(`Retrieved task: ${JSON.stringify(task)}`);

    // Return the task data
    return task;
  } catch (err) {
    // Handle any errors
    console.error(`Failed to retrieve task with id ${id}: ${err.message}`);
    throw err;
  }
}

module.exports = getTaskById;
