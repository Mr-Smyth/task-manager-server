const queryRunner = require("../utils/queryRunner");
const getTaskById = require("./getTaskById");
const assignUserToTask = require("./assignUserToTask");
const getAssignedUser = require("./getAssignedUser");

async function updateTask(id, taskUpdates) {
  console.log(`Updating task ${id} with updates: ${JSON.stringify(taskUpdates)}`);
  
  const { title, description, status, priority, dueDate, userId } = taskUpdates;
  
  let query = `UPDATE tasks SET `;
  let params = [];
  const fields = [];

  // Prepare the update fields and parameters based on provided updates
  if (title) {
    fields.push("title = ?");
    params.push(title);
  }
  if (description) {
    fields.push("description = ?");
    params.push(description);
  }
  if (status) {
    fields.push("status = ?");
    params.push(status);
  }
  if (priority) {
    fields.push("priority = ?");
    params.push(priority);
  }
  if (dueDate !== undefined) { // dueDate can be null
    fields.push("dueDate = ?");
    params.push(dueDate);
  }

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  query += fields.join(", ") + " WHERE id = ?";
  params.push(id);

  try {
    // Execute the update query
    await queryRunner(query, params);

    // Handle user assignment if userId is provided
    if (userId !== undefined) {
      // Get current assigned user
      const currentAssignedUser = await getAssignedUser(id);

      if (userId === null) {
        // Unassign the user if userId is null
        if (currentAssignedUser !== null) {
          await queryRunner("DELETE FROM user_tasks WHERE task_id = ?", [id]);
        }
      } else if (userId !== currentAssignedUser) {
        // If a new user is being assigned, replace the old one
        if (currentAssignedUser !== null) {
          await queryRunner("DELETE FROM user_tasks WHERE task_id = ?", [id]);
        }
        await queryRunner("INSERT OR REPLACE INTO user_tasks (user_id, task_id) VALUES (?, ?)", [userId, id]);
      }
    }

    // Retrieve the updated task object
    const updatedTask = await getTaskById(id);

    // Ensure that the updated task data is returned in the expected format
    const task = updatedTask[0];
    const newAssignedUserTask = await getAssignedUser(id)
    console.log("this Assigned User is: ", newAssignedUserTask)

    return {
      tasks: [
        {
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate,
          created_at: task.created_at,
          updated_at: task.updated_at,
          userId: newAssignedUserTask,
        },
      ],
    };
  } catch (err) {
    console.error(`Error in updateTask: ${err.message}`);
    throw new Error(`Failed to update task: ${err.message}`);
  }
}


module.exports = updateTask;
