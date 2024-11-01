// middleware/sharedValidators.js

// Utility to check for valid or non-empty strings
function isStringValid(value) {
  return typeof value === "string" && value.trim().length > 0;
}

// Trim and validate a field
function trimAndValidateField(value) {
  return typeof value === "string" ? value.trim() : value;
}

module.exports = {
  trimAndValidateField,
  isStringValid,
};