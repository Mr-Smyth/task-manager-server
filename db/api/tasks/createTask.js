const queryRunner = require("../utils/queryRunner");
const logEvent = require("../utils/logEvent");
const assignUserToTask = require("./assignUserToTask");

/**
 * Creates a new task in the database and optionally assigns it to a user.
 * @param {Object} task - The task object containing title, description, status, priority, and dueDate.
 * @param {string} task.title - The title of the task.
 * @param {string} task.description - The description of the task.
 * @param {string} task.status - The status of the task.
 * @param {string} task.priority - The priority of the task.
 * @param {string|null} task.dueDate - The due date of the task, can be null.
 * @param {number} [userId] - Optional user ID to assign the task to.
 * @returns {Promise} - The newly created task object containing its ID, title, and description.
 * @throws {Error} - Throws an error if the task creation fails.
 */
async function createTask(task, userId) {
  console.log(`Creating task: ${task.title}`);

  const query = `INSERT INTO tasks (title, description, status, priority, dueDate) VALUES (?, ?, ?, ?, ?)`;
  const params = [
    task.title,
    task.description,
    task.status,
    task.priority,
    task.dueDate,
  ];

  try {
    // Execute the query to insert a new task and get the generated task ID
    const taskId = await queryRunner(query, params);

    // Construct a more detailed description for the audit log
    const detailedDescription = `Task created - name of task is '${task.title}' with a priority of '${task.priority}' and a status of '${task.status}'`;

    console.log(`Logging event for task ID ${taskId} with description: ${detailedDescription}`); // Add this log

    // Log the event with detailed description
    try {
      await logEvent("CREATE", "tasks", taskId, detailedDescription, userId); // Ensure the function is awaited
    } catch (loggingError) {
      console.error(
        `Failed to log event for task ID ${taskId}: ${loggingError.message}`
      );
    }

    // Assign the task to a user if a userId is provided
    if (userId) {
      await assignUserToTask(userId, taskId);
    }

    // Return the newly created task with all its fields
    return {
      tasks: [
        {
          id: taskId,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    };
  } catch (err) {
    console.error(`Error in createTask: ${err.message}`);
    throw new Error(`Failed to create task: ${err.message}`);
  }
}

module.exports = createTask;
