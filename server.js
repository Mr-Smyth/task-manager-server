// server.js
const express = require("express");
const server = express();

// Middleware to parse JSON bodies
server.use(express.json());

// Middleware to parse URL-encoded data (only if needed)
server.use(express.urlencoded({ extended: false }));

// Start the server
server.listen(3000, () => console.log("Server is running on port 3000"));