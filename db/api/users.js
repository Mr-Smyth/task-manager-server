// db/api/users.js
// Import the SQLite database connection
const db = require("../sqlite");

// Function to create a new user in the database
async function createUser(user) {
  // create/return the promise to be resolved in the controller calling this function
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO users (first_name, last_name, description) VALUES (?, ?, ?)`;
    const params = [user.first_name, user.last_name, user.description];

    // The run() method performs the operation and calls the provided callback function which provides any errors
    db.run(query, params, function (err) {
      if (err) {
        // If an error occurs, reject the Promise with the error message
        reject(new Error(`Failed to create user: ${err.message}`));
      } else {
        // On success, resolve the Promise with the newly created user object
        // (this.lastID) contains the ID of the newly inserted row returned by run()
        const newUser = {
          id: this.lastID,
          first_name: user.first_name,
          last_name: user.last_name,
          description: user.description,
        };
        resolve({ users: newUser }); // Wrap the user in an object as expected
      }
    });
  });
}

// Function to retrieve all users from the database
async function getAllUsers() {
  return new Promise((resolve, reject) => {
    // query retrieves user data from the users table and associated task IDs from the user_tasks table
    // using Group Concat as there could be multiple tasks associated with a user
    // Using Left join as a user may have no tasks, but need to be included
    // finally grouping them so no duplication in users due to join
    const query = `
      SELECT users.*, GROUP_CONCAT(user_tasks.task_id) AS taskIds
      FROM users
      LEFT JOIN user_tasks ON users.id = user_tasks.user_id
      GROUP BY users.id
    `;

    // Execute Query - The all() method retrieves all rows from the result set and calls the callback function
    db.all(query, [], (err, rows) => {
      if (err) {
        // If an error occurs, reject the Promise with an error message
        reject(new Error(`Failed to retrieve users: ${err.message}`));
      } else {
        // rows is an array of retrieved user objects - Each user object includes a taskIds field, which is a comma-separated string of task IDs
        // Add the user name and description by spreading row of rows
        // taskIds are then (if exists) - mapped into an array of the split string of task IDs converted to integers which i get from the group concat
        // or it will be an empty array
        const users = rows.map((row) => ({
          id: row.id,
          first_name: row.first_name,
          last_name: row.last_name,
          description: row.description,
          taskIds: row.taskIds ? row.taskIds.split(",").map((id) => parseInt(id)) : [],
        }));
        // On success, resolve the Promise with the array of user rows
        resolve(users);
      }
    });
  });
}

// Function to retrieve a user by their ID
// May use this as a seperate api action
// but initially need it to check if a user exists to allow
// updating of a user in updateUser
async function getUserById(id) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM users WHERE id = ?`;
    const params = [id];

    // The get() method retrieves the first row of the result set and calls the callback function
    db.get(query, params, (err, row) => {
      if (err) {
        // If an error occurs, reject the Promise with an error message
        reject(new Error(`Failed to retrieve user with id ${id}: ${err.message}`));
      } else {
        // On success, resolve the Promise with the user row
        resolve(row);
      }
    });
  });
}

// Function to update a user's details by their ID (support partial/full updates - PATCH/PUT)
async function updateUser(id, userUpdates) {
  return new Promise((resolve, reject) => {
    //  Build the SQL query based on provided fields
    const fields = [];
    const params = [];

    // Here we make it possible to either PUT or PATCH
    // by default the fields and params will be blank and only
    // populated if the data is passed in the body of the request
    if (userUpdates.first_name) {
      fields.push("first_name = ?");
      params.push(userUpdates.first_name);
    }
    if (userUpdates.last_name) {
      fields.push("last_name = ?");
      params.push(userUpdates.last_name);
    }
    if (userUpdates.description) {
      fields.push("description = ?");
      params.push(userUpdates.description);
    }

    if (fields.length === 0) {
      // If no fields are provided, do nothing and resolve the promise
      resolve(null);
      return;
    }

    // Append the WHERE clause with the ID
    // set the fields on the query
    const query = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    // add the params containing the id of the user
    params.push(id);

    // Execute the SQL UPDATE statement query with the params (id)
    db.run(query, params, function (err) {
      if (err) {
        // If an error occurs during the update, reject the Promise with an error message
        reject(new Error(`Failed to update user with id ${id}: ${err.message}`));
      } else {
        // On success, retrieve the updated user and resolve the Promise with the updated user object
        // this will indicate the user exists as it could be found in getUserById
        // and allow the update to succeed
        getUserById(id).then(resolve).catch(reject);
      }
    });
  });
}

// Function to delete a user by their ID
async function deleteUser(id) {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM users WHERE id = ?`;
    const params = [id];

    // First, check if the user exists by calling getUserById
    getUserById(id)
      .then((user) => {
        if (!user) {
          // If the user does not exist, resolve the Promise with null
          resolve(null);
        } else {
          // If the user exists, proceed with the deletion
          // The run() method executes the DELETE statement and calls the callback function
          db.run(query, params, function (err) {
            if (err) {
              // If an error occurs during deletion, reject the Promise with an error message
              reject(new Error(`Failed to delete user with id ${id}: ${err.message}`));
            } else {
              // On success, resolve with a success message to the controller 
              resolve({ message: 'User deleted successfully' });
            }
          });
        }
      })
      // On success, resolution will only happen if the user exists - which depends on getUserById
      // if it doesnt - it will fail. Also if any part of the delete query fails the promise will also fail
      .catch(reject);
  });
}

module.exports = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
