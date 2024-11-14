const queryRunner = require("../utils/queryRunner");

/**
 * Creates a new task in the database and optionally assigns it to a user.
 * @param {Object} task - The task object containing title and description.
 * @param {string} task.title - The title of the task.
 * @param {string} task.description - The description of the task.
 * @param {number} [userId] - Optional user ID to assign the task to.
 * @returns {Promise} - The newly created task object containing its ID, title, and description.
 * @throws {Error} - Throws an error if the task creation fails.
 */
async function createTask(task, userId) {
  console.log(`Creating task: ${task.title}`);
  const query = `INSERT INTO tasks (title, description) VALUES (?, ?)`;
  const params = [task.title, task.description];
  try {
    // Execute the query to insert a new task and get the generated task ID
    const taskId = await queryRunner(query, params);

    // Create a task object with the returned task ID
    const newTask = {
      id: taskId,
      title: task.title,
      description: task.description,
    };

    // Assign the task to a user if a userId is provided
    if (userId) {
      await assignUserToTask(userId, taskId);
    }

    // debugging purposes
    console.log(`Task created successfully with ID: ${taskId}`);
    return newTask;
  } catch (err) {
    // handle any errors
    console.error(`Error in createTask: ${err.message}`);
    throw new Error(`Failed to create task: ${err.message}`);
  }
}

module.exports = createTask;
