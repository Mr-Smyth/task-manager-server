// middleware/errorHandler.js

// This file is to hold any error handling

// Generic error-handling middleware
function errorHandler(err, req, res, next) {
    // log stack trace for debugging
    console.error(err.stack); 
    res.status(500).json({ error: "Something went wrong on the server." });
  }
  
  module.exports = errorHandler;