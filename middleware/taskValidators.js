// middleware/taskValidators.js

const { isStringValid, trimAndValidateField } = require("./sharedValidators");

function validateTask(req, res, next) {
  let { title, description } = req.body;
  const errors = [];

  title = trimAndValidateField(title);
  description = trimAndValidateField(description);

  if (!isStringValid(title)) {
    errors.push("Title is required and must be a non-empty string.");
  }
  if (!isStringValid(description)) {
    errors.push("Description is required and must be a non-empty string.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  req.body.title = title;
  req.body.description = description;

  next();
}

function validateUpdateTask(req, res, next) {
  let { title, description } = req.body;
  const errors = [];

  title = trimAndValidateField(title);
  description = trimAndValidateField(description);

  if (title && !isStringValid(title)) {
    errors.push("Title must be a non-empty string.");
  }
  if (!isStringValid(description)) {
    errors.push("Description is required and must be a non-empty string.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  req.body.title = title;
  req.body.description = description;

  next();
}

module.exports = {
  validateTask,
  validateUpdateTask,
};
