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
        // then we add it to the user object passed in
        resolve({ id: this.lastID, ...user });
      }
    });
  });
}

// Function to retrieve all users from the database
async function getAllUsers() {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM users`;

    // The all() method retrieves all rows from the result set and calls the callback function
    db.all(query, [], (err, rows) => {
      if (err) {
        // If an error occurs, reject the Promise with an error message
        reject(new Error(`Failed to retrieve users: ${err.message}`));
      } else {
        // On success, resolve the Promise with the array of user rows
        resolve(rows);
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
      fields.push('first_name = ?');
      params.push(userUpdates.first_name);
    }
    if (userUpdates.last_name) {
      fields.push('last_name = ?');
      params.push(userUpdates.last_name);
    }
    if (userUpdates.description) {
      fields.push('description = ?');
      params.push(userUpdates.description);
    }

    if (fields.length === 0) {
      // If no fields are provided, do nothing and resolve the promise
      resolve(null);
      return;
    }

    // Append the WHERE clause with the ID
    // set the fields on the query
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
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

module.exports = {
  createUser,
  getAllUsers,
  updateUser
};