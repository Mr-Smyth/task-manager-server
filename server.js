// server.js
const express = require("express");
const server = express();
const userRoutes = require("./routes/users");
const errorHandler = require("./middleware/errorHandler");
const cors = require('cors');

// Middleware to parse JSON bodies
server.use(express.json());

// Enable CORS
/* allow a web application(task-manager) to access this data from this
server as it is on a domain different than the domain that serves the web application(task-manager)
 */
server.use(cors());

// Middleware to parse URL-encoded data (only if needed)
server.use(express.urlencoded({ extended: false }));

// Add the userRoutes module on the /task-manager-data/api/users path.
server.use("/task-manager-data/api/users", userRoutes);

// Use the errorHandling middleware to handle issues
server.use(errorHandler);

// Start the server
server.listen(3000, () => console.log("Server is running on port 3000"));