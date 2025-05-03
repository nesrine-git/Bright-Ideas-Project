import extractValidationErrors from './ErrorExtractor.js';

// This function standardizes error objects into a consistent format
const normalizeError = (err) => {
  // Set up a base error structure with defaults for name, statusCode, and message
  const normalized = {
    name: err.name || 'Server Error',
    statusCode: err.statusCode || 500,
    message: err.message || 'Something went wrong',
    validations: {}, // Will hold field-level validation errors if any
  };

  // If the error is a Mongoose ValidationError, adjust the status code and extract details
  if (err.name === 'ValidationError') {
    normalized.statusCode = 400;  // Bad Request
    const errors = extractValidationErrors(err); // Extract detailed validation messages
    if (Object.keys(errors).length) {
      normalized.validations = errors; // Add validation messages to the normalized object
    }
  }

  // Return the normalized error object
  return normalized;
};

export default normalizeError;
