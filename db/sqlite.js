// db/sqlite.js

// tested by running this file seperately - and the table was created so should be good
/* 
% node sqlite.js
Connected to the SQLite database.
Users table ready (created if it did not exist).
*/

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Define the path to the database file
const dbPath = path.resolve(
  __dirname,
  "../public/api/task-manager-data.sqlite3"
);

// Create and export the database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");

    // Create the 'users' table if it doesn't exist
    db.run(
      ` CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            description TEXT
        )`,
      (err) => {
        if (err) {
          console.error("Error creating users table:", err.message);
        } else {
          console.log("Users table ready (created if it did not exist).");
        }
      }
    );
  }
});

// Create the 'tasks' table if it doesn't exist
db.run(
  ` CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT
    )`,
  (err) => {
    if (err) {
      console.error("Error creating tasks table:", err.message);
    } else {
      console.log("Tasks table ready (created if it did not exist).");
    }
  }
);

// setup the user / task table
// needs a table with a many to many relationship as users can be linked to multiple tasks
db.run(
  `CREATE TABLE IF NOT EXISTS user_tasks (
      user_id INTEGER,
      task_id INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(task_id) REFERENCES tasks(id)
   )`,
  (err) => {
    if (err) {
      console.error("Error creating user_tasks table:", err.message);
    } else {
      console.log("user_tasks table ready (created if it did not exist).");
    }
  }
);

module.exports = db;