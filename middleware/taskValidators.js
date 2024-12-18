const { isStringValid, trimAndValidateField } = require("./sharedValidators");

function validateTask(req, res, next) {
  let { title, description, priority, status, dueDate } = req.body;
  const errors = [];

  // Validate the title and description
  title = trimAndValidateField(title);
  description = trimAndValidateField(description);

  if (!isStringValid(title)) {
    errors.push("Title is required and must be a non-empty string.");
  }
  if (!isStringValid(description)) {
    errors.push("Description is required and must be a non-empty string.");
  }

  // Validate priority field
  const validPriorities = ['low', 'normal', 'high', 'urgent'];
  if (!validPriorities.includes(priority)) {
    errors.push(`Priority must be one of the following: ${validPriorities.join(', ')}`);
  }

  // Validate status field
  const validStatuses = ['new', 'in-triage', 'in-review', 'in-progress', 'on-hold', 'done'];
  if (!validStatuses.includes(status)) {
    errors.push(`Status must be one of the following: ${validStatuses.join(', ')}`);
  }

  // Validate dueDate (optional, can be null or a valid date)
  if (dueDate && isNaN(Date.parse(dueDate))) {
    errors.push("Due date must be a valid date format.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  req.body.title = title;
  req.body.description = description;
  req.body.priority = priority;
  req.body.status = status;
  req.body.dueDate = dueDate;

  next();
}

function validateUpdateTask(req, res, next) {
  let { title, description, priority, status, dueDate } = req.body;
  const errors = [];

  // Validate the title and description
  title = trimAndValidateField(title);
  description = trimAndValidateField(description);

  if (title && !isStringValid(title)) {
    errors.push("Title must be a non-empty string.");
  }
  if (!isStringValid(description)) {
    errors.push("Description is required and must be a non-empty string.");
  }

  // Validate priority field
  const validPriorities = ['low', 'normal', 'high', 'urgent'];
  if (priority && !validPriorities.includes(priority)) {
    errors.push(`Priority must be one of the following: ${validPriorities.join(', ')}`);
  }

  // Validate status field
  const validStatuses = ['new', 'in-triage', 'in-review', 'in-progress', 'on-hold', 'done'];
  if (status && !validStatuses.includes(status)) {
    errors.push(`Status must be one of the following: ${validStatuses.join(', ')}`);
  }

  // Validate dueDate (optional, can be null or a valid date)
  if (dueDate && isNaN(Date.parse(dueDate))) {
    errors.push("Due date must be a valid date format.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  req.body.title = title;
  req.body.description = description;
  req.body.priority = priority;
  req.body.status = status;
  req.body.dueDate = dueDate;

  next();
}

module.exports = {
  validateTask,
  validateUpdateTask,
};
