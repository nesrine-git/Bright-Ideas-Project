// A utility function to standardize all HTTP responses from the server
const response = (res, statusCode, success, message, data = null, error = null) => {
  // Create a base response object with success status and message
  const sendResponse = { 
    success, 
    message,
    statusCode, //Useful for frontend debugging or logging.
    timestamp: new Date().toISOString() }; //Helpful for tracking when the response was generated.

  // If data is provided, include it in the response
  if (data) sendResponse.data = data;

  // If an error is provided, include it in the response
  if (error) sendResponse.error = error;

  // Send the response with the specified HTTP status code
  return res.status(statusCode).json(sendResponse);
};

export default response;
