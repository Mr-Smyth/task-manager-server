const queryRunner = require("../utils/queryRunner");

/**
 * Retrieves all tasks from the database.
 *
 * This function queries the database for all records in the `tasks` table.
 * It uses the `queryRunner` utility to execute the SQL query and fetch the results.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of tasks. Each task is represented as an object containing its fields.
 *
 * @throws {Error} If there is an issue executing the query or retrieving the tasks, an error is thrown.
 */
async function getAllTasks() {
  console.log("Retrieving all tasks from the database...");
  const query = `SELECT * FROM tasks`;

  try {
    // Use queryRunner to fetch all tasks from the database
    const tasks = await queryRunner(query, []);
    console.log(`Retrieved tasks: ${JSON.stringify(tasks)}`);
    return tasks;
  } catch (err) {
    // Handle any errors
    console.error(`Failed to retrieve tasks: ${err.message}`);
    throw err;
  }
}

module.exports = getAllTasks;
