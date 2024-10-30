// Import the SQLite database connection
const db = require("../sqlite");

// Function to create a new task in the database
async function createTask(task, userId) {
  return new Promise((resolve, reject) => {
    // SQL query to insert a new task into the tasks table
    const query = `INSERT INTO tasks (title, description) VALUES (?, ?)`;
    const params = [task.title, task.description];

    // The run() method performs the operation and calls the provided callback function which provides any errors
    db.run(query, params, function (err) {
      if (err) {
        // If an error occurs, reject the Promise with the error message
        reject(new Error(`Failed to create task: ${err.message}`));
      } else {
        // On success, create a new task object with the generated ID
        const newTask = {
          id: this.lastID,
          title: task.title,
          description: task.description,
        };
        if (userId) {
          // If a userId is provided, associate the task with the user in the users_tasks table
          const userTaskQuery = `INSERT INTO users_tasks (user_id, task_id) VALUES (?, ?)`;
          db.run(userTaskQuery, [userId, newTask.id], (err) => {
            if (err) {
              // If an error occurs while associating, reject the Promise
              reject(
                new Error(`Failed to associate task with user: ${err.message}`)
              );
            } else {
              // Resolve the Promise with the new task object
              resolve(newTask);
            }
          });
        } else {
          // If no userId is provided, resolve the Promise with the new task object
          resolve(newTask);
        }
      }
    });
  });
}

// Function to retrieve all tasks from the database
async function getAllTasks() {
  return new Promise((resolve, reject) => {
    // SQL query to select all tasks
    const query = `SELECT * FROM tasks`;

    // The all() method retrieves all rows from the result set and calls the callback function
    db.all(query, [], (err, rows) => {
      if (err) {
        // If an error occurs, reject the Promise with an error message
        reject(new Error(`Failed to retrieve tasks: ${err.message}`));
      } else {
        // On success, resolve the Promise with the array of task rows
        resolve(rows);
      }
    });
  });
}

// Function to retrieve a task by its ID
async function getTaskById(id) {
  return new Promise((resolve, reject) => {
    // SQL query to select a task by ID
    const query = `SELECT * FROM tasks WHERE id = ?`;
    const params = [id];

    // The get() method retrieves the first row of the result set and calls the callback function
    db.get(query, params, (err, row) => {
      if (err) {
        // If an error occurs, reject the Promise with an error message
        reject(
          new Error(`Failed to retrieve task with id ${id}: ${err.message}`)
        );
      } else {
        // On success, resolve the Promise with the task row
        resolve(row);
      }
    });
  });
}

// Function to update a task by its ID
async function updateTask(id, taskUpdates) {
  return new Promise((resolve, reject) => {
    // Build the SQL query based on provided fields
    const fields = [];
    const params = [];

    // Check which fields to update based on taskUpdates object
    if (taskUpdates.title) {
      fields.push("title = ?");
      params.push(taskUpdates.title);
    }
    if (taskUpdates.description) {
      fields.push("description = ?");
      params.push(taskUpdates.description);
    }

    if (fields.length === 0) {
      // If no fields are provided, do nothing and resolve the promise
      resolve(null);
      return;
    }

    // Append the WHERE clause with the ID
    const query = `UPDATE tasks SET ${fields.join(", ")} WHERE id = ?`;
    params.push(id);

    // Execute the SQL UPDATE statement query with the params (id)
    db.run(query, params, function (err) {
      if (err) {
        // If an error occurs during the update, reject the Promise with an error message
        reject(
          new Error(`Failed to update task with id ${id}: ${err.message}`)
        );
      } else {
        // On success, resolve the Promise with the updated task object
        getTaskById(id)
          .then((updatedTask) => {
            // Wrap the updated task in an object for response
            resolve(updatedTask);
          })
          .catch(reject);
      }
    });
  });
}

// Function to delete a task by its ID
async function deleteTask(id) {
  return new Promise((resolve, reject) => {
    // SQL query to delete a task by ID
    const query = `DELETE FROM tasks WHERE id = ?`;
    const params = [id];

    // First, check if the task exists by calling getTaskById
    getTaskById(id)
      .then((task) => {
        if (!task) {
          // If the task does not exist, resolve the Promise with null
          resolve(null);
        } else {
          // If the task exists, proceed with the deletion
          db.run(query, params, function (err) {
            if (err) {
              // If an error occurs during deletion, reject the Promise with an error message
              reject(
                new Error(`Failed to delete task with id ${id}: ${err.message}`)
              );
            } else {
              // On success, resolve with a success message
              resolve({ message: "Task deleted successfully" });
            }
          });
        }
      })
      .catch(reject);
  });
}

// Export the task-related functions for use in other modules
module.exports = {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
};
