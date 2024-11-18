const queryRunner = require("../utils/queryRunner");

/**
 * Retrieves all users from the database, including their associated task IDs.
 *
 * The function performs a SQL query to fetch user information and any tasks they are associated with.
 * It returns a list of users, where each user includes their personal details (first_name, last_name, description)
 * and an array of associated task IDs.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of user objects.
 * Each user object contains:
 * - id: The user's unique identifier.
 * - first_name: The user's first name.
 * - last_name: The user's last name.
 * - description: A description associated with the user.
 * - taskIds: An array of task IDs associated with the user. This array may be empty if no tasks are found.
 *
 * @throws {Error} If there is an error executing the query or processing the data, an error is thrown with a message.
 */
async function getAllUsers() {
  try {
    // SQL query to retrieve user details along with associated task IDs
    const query = `SELECT users.*, GROUP_CONCAT(user_tasks.task_id) AS taskIds 
                   FROM users 
                   LEFT JOIN user_tasks ON users.id = user_tasks.user_id 
                   GROUP BY users.id`;

    // Execute the query using the queryRunner utility
    const rows = await queryRunner(query, []);

    // Map through each row and transform the result
    const users = rows.map((row) => {
      let taskIds = [];

      // If taskIds is a non-null string, process it into an array of integers
      if (row.taskIds) {
        taskIds = row.taskIds
          .split(",") // Split the comma-separated task IDs
          .map((id) => parseInt(id, 10)) // Convert each ID to an integer
          .filter((id) => !isNaN(id)); // Filter out any invalid IDs (NaN)
      }

      // Return the transformed user object with relevant fields
      return {
        id: row.id,
        first_name: row.first_name,
        last_name: row.last_name,
        description: row.description,
        taskIds: taskIds, // Always return the taskIds array, even if it's empty
      };
    });

    // Return the array of user objects
    return users;
  } catch (err) {
    // Handle any errors
    console.error(`Error in getAllUsers: ${err.message}`);
    throw new Error(`Failed to retrieve users: ${err.message}`);
  }
}

module.exports = getAllUsers;
