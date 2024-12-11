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
          logTableSchema("users");
        }
      }
    );

    // Create the 'tasks' table if it doesn't exist
    db.run(
      ` CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT NOT NULL CHECK(status IN ('new', 'in-triage', 'in-review', 'in-progress', 'on-hold', 'done')),
            priority TEXT NOT NULL CHECK(priority IN ('low', 'normal', 'high', 'urgent')),
            dueDate DATETIME DEFAULT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`,
      (err) => {
        if (err) {
          console.error("Error creating tasks table:", err.message);
        } else {
          console.log("Tasks table ready (created if it did not exist).");
          logTableSchema("tasks");
        }
      }
    );

    // Create the 'user_tasks' table if it doesn't exist
    db.run(
      `CREATE TABLE IF NOT EXISTS user_tasks (
    user_id INTEGER NOT NULL,
    task_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, task_id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(task_id) REFERENCES tasks(id)
  )`,
      (err) => {
        if (err) {
          console.error("Error creating user_tasks table:", err.message);
        } else {
          console.log("user_tasks table ready (created if it did not exist).");
          logTableSchema("user_tasks");
        }
      }
    );

    // Create the 'audit' table if it doesn't exist
    db.run(
      `CREATE TABLE IF NOT EXISTS audit (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL, -- 'CREATE', 'READ', 'UPDATE', 'DELETE'
    entity TEXT NOT NULL, -- e.g., 'users', 'tasks'
    entity_id INTEGER, -- ID of the affected entity
    description TEXT, -- Description of the operation
    user_id INTEGER, -- Optional, ID of the user performing the action
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
      (err) => {
        if (err) {
          console.error("Error creating audit table:", err.message);
        } else {
          console.log("Audit table ready (created if it did not exist).");
          logTableSchema("audit");
        }
      }
    );
    
  }
});

// Function to log table schema
function logTableSchema(tableName) {
  db.all(`PRAGMA table_info(${tableName})`, [], (err, rows) => {
    if (err) {
      console.error(
        `Error retrieving schema for table ${tableName}:`,
        err.message
      );
    } else {
      console.log(`Schema for table ${tableName}:`);
      rows.forEach((row) => {
        console.log(
          ` - ${row.cid}: ${row.name} ${row.type} (notnull: ${row.notnull}, default: ${row.dflt_value})`
        );
      });
    }
  });
}

module.exports = db;
