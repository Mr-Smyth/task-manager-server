const db = require("../../sqlite");

/**
 * Executes a database query (either SELECT or non-SELECT queries) on the SQLite database.
 *
 * The function handles two types of queries:
 * 1. SELECT queries: Returns rows of data as an array.
 * 2. Non-SELECT queries (INSERT, UPDATE, DELETE, etc.): Returns the last inserted ID for INSERT queries.
 *
 * @param {string} query - The SQL query string to be executed.
 * @param {Array} params - The parameters to be used in the query. These are passed to the query to prevent SQL injection.
 * @returns {Promise<Array|number>} Resolves with:
 * - An array of rows for SELECT queries (or an empty array if no rows found).
 * - The last inserted ID for non-SELECT queries (for example, after an INSERT).
 * @throws {Error} If the query execution fails, an error is thrown with a message.
 */
function queryRunner(query, params) {
  return new Promise((resolve, reject) => {
    // Log the query and parameters for debugging purposes
    console.log("Running query:", query);
    console.log("With params:", params);

    // Handle SELECT queries
    if (query.startsWith("SELECT")) {
      console.log("Executing SELECT query...");

      // Execute the SELECT query using the db.all() method
      db.all(query, params, (err, rows) => {
        if (err) {
          // If an error occurs during the SELECT query execution, reject the promise
          console.error("Error executing query:", err);
          reject(new Error(`Failed to execute query: ${err.message}`));
        } else {
          // Debugging Purposes
          console.log("Raw rows received from queryRunner:", rows);

          // Ensure the result is an array
          if (!Array.isArray(rows)) {
            console.error("Rows returned are not an array! Received:", rows);
            reject(
              new Error("Expected rows to be an array, but got something else.")
            );
            return;
          }

          // If no rows are returned, resolve with an empty array
          if (rows.length === 0) {
            // Debugging Purposes
            console.log("No rows found, returning empty array.");
            resolve([]);
            return;
          }

          // Resolve with the rows if the query is successful
          resolve(rows);
        }
      });
    } else {
      // Handle non-SELECT queries (e.g., INSERT, UPDATE, DELETE)
      db.run(query, params, function (err) {
        if (err) {
          // If an error occurs during the non-SELECT query execution, reject the promise
          reject(new Error(`Failed to execute query: ${err.message}`));
        } else {
          // Resolve with the last inserted ID (relevant for INSERT queries)
          // `this.lastID` holds the ID of the last inserted row for INSERTs
          resolve(this.lastID);
        }
      });
    }
  });
}

module.exports = queryRunner;
