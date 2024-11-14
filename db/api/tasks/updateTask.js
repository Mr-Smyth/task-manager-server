const queryRunner = require("../utils/queryRunner");
const getTaskById = require("./getTaskById");
const assignUserToTask = require("./assignUserToTask");
const getAssignedUser = require("./getAssignedUser");

/**
 * Updates a task with the specified changes (title, description, userId).
 * If a userId is provided, it will also update the user assignment for the task.
 *
 * @param {number} id - The ID of the task to update.
 * @param {Object} taskUpdates - The updates to apply to the task.
 * @param {string} [taskUpdates.title] - The new title of the task (optional).
 * @param {string} [taskUpdates.description] - The new description of the task (optional).
 * @param {number|null} [taskUpdates.userId] - The ID of the user to assign to the task. If `null`, the user will be unassigned (optional).
 *
 * @returns {Promise<Object>} The updated task object.
 * @throws {Error} If no fields are provided for the update or if the update fails.
 */
async function updateTask(id, taskUpdates) {
  // Debugging Purposes
  console.log(
    `Updating task ${id} with updates: ${JSON.stringify(taskUpdates)}`
  );

  const { title, description, userId } = taskUpdates;
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

  // Ensure that at least one field is being updated
  if (fields.length === 0) {
    console.error("No valid fields provided for update");
    throw new Error("No fields to update");
  }

  // Construct the query and add task ID to the parameters
  query += fields.join(", ") + " WHERE id = ?";
  params.push(id);

  try {
    // Execute the update query
    await queryRunner(query, params);
    // Debugging Purposes
    console.log(`Task ${id} updated successfully`);

    // Handle user assignment if userId is provided
    if (userId !== undefined) {
      // Fetch the current task data to check the assigned user
      const currentTask = await getTaskById(id);
      const linkedUserId = await getAssignedUser(id);

      // Debugging Purposes
      console.log("Current User Id = ", linkedUserId);

      // Query to unassign a user from the task
      const unassignQuery = `DELETE FROM user_tasks WHERE task_id = ?`;

      // If userId is null, unassign the user
      if (userId === null) {
        if (linkedUserId !== null) {
          await queryRunner(unassignQuery, [id]);
          console.log(`User unassigned from task ${id}`);
        }
      }
      // If userId is different from the currently linked user, reassign the task to the new user
      else if (userId !== linkedUserId) {
        // Unassign the current user before reassigning a new user
        if (linkedUserId !== null) {
          await queryRunner(unassignQuery, [id]);
        }
        // Assign the new user to the task
        await assignUserToTask(userId, id);
        console.log(`Task ${id} reassigned to user ${userId}`);
      }
      // If the task is already assigned to the same user, no change is made
      else {
        console.log(
          `Task ${id} already assigned to user ${userId}, no change made`
        );
      }
    }

    // Retrieve and return the updated task object
    const updatedTask = await getTaskById(id);
    // Debugging Purposes
    console.log(`Retrieved updated task: ${JSON.stringify(updatedTask)}`);
    return updatedTask;
  } catch (err) {
    // Handle any errors
    console.error(`Error in updateTask: ${err.message}`);
    throw new Error(`Failed to update task: ${err.message}`);
  }
}

module.exports = updateTask;
