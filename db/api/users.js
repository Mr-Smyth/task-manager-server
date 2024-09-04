// db/api/users.js
// Import the SQLite database connection
const db = require("../sqlite");

// Function to create a new user in the database
async function createUser(user) {
  // create/return the promise to be resolved in the controller calling this
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

module.exports = {
  createUser,
  getAllUsers
};
