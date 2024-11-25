const queryRunner = require("../utils/queryRunner");

/**
 * Creates a new user in the database and returns the newly created user's information.
 *
 * This function constructs an SQL `INSERT` query to add a new user to the `users` table.
 * It then calls `queryRunner` to execute the query and fetch the ID of the newly created user.
 * The returned user data is formatted and returned as an object.
 *
 * @param {Object} user - The user object containing the details of the new user.
 * @param {string} user.first_name - The first name of the user.
 * @param {string} user.last_name - The last name of the user.
 * @param {string} user.description - A description of the user.
 *
 * @returns {Object} An object containing the newly created user's information.
 * @returns {Object} return.users - The newly created user's data.
 * @returns {number} return.users.id - The ID of the newly created user.
 * @returns {string} return.users.first_name - The first name of the newly created user.
 * @returns {string} return.users.last_name - The last name of the newly created user.
 * @returns {string} return.users.description - The description of the newly created user.
 *
 * @throws {Error} If the user creation fails, an error is thrown with a descriptive message.
 */
async function createUser(user) {
  // SQL query to insert a new user into the database
  const query = `INSERT INTO users (first_name, last_name, description) VALUES (?, ?, ?)`;

  // Parameters for the query: user details to be inserted
  const params = [user.first_name, user.last_name, user.description];

  try {
    // Run the query using the queryRunner utility and get the last inserted ID
    const lastId = await queryRunner(query, params);

    // Return the newly created user's data inside a "users" array
    return {
      users: [
        {
          id: lastId,
          first_name: user.first_name,
          last_name: user.last_name,
          description: user.description,
          taskIds: [],
        },
      ],
    };
  } catch (err) {
    // Handle any errors
    throw new Error(`Failed to create user: ${err.message}`);
  }
}

module.exports = createUser;
