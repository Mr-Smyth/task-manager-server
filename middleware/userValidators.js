// middleware/userValidators.js

const { isStringValid, trimAndValidateField } = require("./sharedValidators");

function validateUser(req, res, next) {
  let { first_name, last_name, description } = req.body;
  const errors = [];

  first_name = trimAndValidateField(first_name);
  last_name = trimAndValidateField(last_name);
  description = trimAndValidateField(description);

  if (!isStringValid(first_name)) {
    errors.push("First name is required and must be a non-empty string.");
  }
  if (!isStringValid(last_name)) {
    errors.push("Last name is required and must be a non-empty string.");
  }
  if (!isStringValid(description)) {
    errors.push("Description is required and must be a non-empty string.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  req.body.first_name = first_name;
  req.body.last_name = last_name;
  req.body.description = description;

  next();
}

function validateUpdateUser(req, res, next) {
  let { first_name, last_name, description } = req.body;
  const errors = [];

  first_name = trimAndValidateField(first_name);
  last_name = trimAndValidateField(last_name);
  description = trimAndValidateField(description);

  if (first_name && !isStringValid(first_name)) {
    errors.push("First name must be a non-empty string.");
  }
  if (last_name && !isStringValid(last_name)) {
    errors.push("Last name must be a non-empty string.");
  }
  if (!isStringValid(description)) {
    errors.push("Description is required and must be a non-empty string.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  req.body.first_name = first_name;
  req.body.last_name = last_name;
  req.body.description = description;

  next();
}

module.exports = {
  validateUser,
  validateUpdateUser,
};