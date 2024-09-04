// middleware/validators.js

// This file contains validation middleware for user creation and update requests.

// Utility to check for valid or non-empty strings
function isStringValid(value) {
    return typeof value === "string" && value.trim().length > 0;
  }
  
  // Validation middleware for creating a user
  function validateUser(req, res, next) {
    const { first_name, last_name, description } = req.body;
    const errors = [];
  
    if (!isStringValid(first_name)) {
      errors.push("First name is required and must be a non-empty string.");
    }
    if (!isStringValid(last_name)) {
      errors.push("Last name is required and must be a non-empty string.");
    }
    if (description && !isStringValid(description)) {
      errors.push("Description must be a valid string if provided.");
    }
  
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
  
    // Continue to the next middleware
    next();
  }
  
  // Validation middleware for PATCH/PUT updates
  function validateUpdateUser(req, res, next) {
    const { first_name, last_name, description } = req.body;
    const errors = [];
  
    if (first_name && !isStringValid(first_name)) {
      errors.push("First name must be a non-empty string.");
    }
  
    if (last_name && !isStringValid(last_name)) {
      errors.push("Last name must be a non-empty string.");
    }
  
    if (description && !isStringValid(description)) {
      errors.push("Description must be a valid string if provided.");
    }
  
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
  
    // Continue to the next middleware
    next();
  }
  
  module.exports = {
    validateUser,
    validateUpdateUser
  };
  