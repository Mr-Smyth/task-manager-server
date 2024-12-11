const dbCreateTask = require("../db/api/tasks/createTask");
const dbGetAllTasks = require("../db/api/tasks/getAllTasks");
const dbUpdateTask = require("../db/api/tasks/updateTask");
const dbDeleteTask = require("../db/api/tasks/deleteTask");

/**
 * Handles the creation of a new task.
 *
 * Expects the request body to contain task data, including the userId of the task creator.
 * Creates a task using the provided data and returns the newly created task.
 *
 * @param {Object} req - The request object, containing the task data in req.body.
 * @param {Object} res - The response object, used to send the HTTP response.
 * @returns {Object} A JSON response containing the created task or an error message.
 */
async function createTask(req, res) {
  try {
    const { title, description, status, priority, dueDate, userId } = req.body;

    // Ensure that the required fields (title, description, etc.) are available
    if (!title || !description || !status || !priority) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const taskData = {
      title,
      description,
      status,
      priority,
      dueDate: dueDate || null, // allow dueDate to be null
    };

    const newTask = await dbCreateTask(taskData, userId);

    // Return the created task with status 201 (Created)
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to create task" });
  }
}

/**
 * Retrieves all tasks from the database.
 *
 * This function fetches the list of all tasks and returns them in the response.
 *
 * @param {Object} req - The request object (not used here, but part of the signature).
 * @param {Object} res - The response object, used to send the list of tasks or an error message.
 * @returns {Object} A JSON response containing a list of tasks or an error message.
 */
async function getAllTasks(req, res) {
  try {
    // Fetch all tasks from the database
    const tasks = await dbGetAllTasks();
    // Return the tasks with status 200 (OK)
    res.status(200).json({ tasks });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ error: "Failed to retrieve tasks" });
  }
}

/**
 * Handles the update of an existing task.
 *
 * Expects the task ID as a parameter in the URL and the task data (title, description, userId) in the request body.
 * Attempts to update the task with the provided ID and data.
 *
 * @param {Object} req - The request object, containing the task ID in req.params.id and the task data in req.body.
 * @param {Object} res - The response object, used to send the updated task or an error message.
 * @returns {Object} A JSON response containing the updated task or an error message.
 */
async function updateTask(req, res) {
  try {
    const taskId = req.params.id;
    const { title, description, status, priority, dueDate, userId } = req.body;

    const taskData = {
      title,
      description,
      status,
      priority,
      dueDate: dueDate || null,
      userId,
    };

    const updatedTask = await dbUpdateTask(taskId, taskData);

    if (updatedTask) {
      res.status(200).json(updatedTask);
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    console.error("Error updating task:", error.message);
    res.status(500).json({ error: "Failed to update task" });
  }
}

/**
 * Handles the deletion of a task.
 *
 * Expects the task ID as a parameter in the URL.
 * Attempts to delete the task with the provided ID and returns a success response or an error message.
 *
 * @param {Object} req - The request object, containing the task ID in req.params.id.
 * @param {Object} res - The response object, used to send a success response or an error message.
 * @returns {Object} A JSON response indicating the success or failure of the deletion.
 */
async function deleteTask(req, res) {
  try {
    // Pass the task ID to the database handler for deletion
    const deleted = await dbDeleteTask(req.params.id);

    if (deleted) {
      // Return status 204 (No Content) for successful deletion
      res.status(204).send();
    } else {
      // Task not found, return 404 error
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    // Handle any errors
    res.status(500).json({ error: "Failed to delete task" });
  }
}

module.exports = {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
};
