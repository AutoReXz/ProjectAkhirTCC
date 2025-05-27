/**
 * Utility functions for standardizing API responses
 */

/**
 * Create a success response
 * @param {string} message - Success message
 * @param {Object} data - Response data
 * @param {number} statusCode - HTTP status code (default: 200)
 * @returns {Object} Standardized success response object
 */
const successResponse = (message, data = null, statusCode = 200) => ({
  success: true,
  message,
  data,
  statusCode
});

/**
 * Create an error response
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {Object} errors - Additional error details
 * @returns {Object} Standardized error response object
 */
const errorResponse = (message, statusCode = 500, errors = null) => ({
  success: false,
  message,
  errors,
  statusCode
});

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {Object} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const sendSuccessResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {Object} errors - Additional error details
 */
const sendErrorResponse = (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};

module.exports = {
  successResponse,
  errorResponse,
  sendSuccessResponse,
  sendErrorResponse
};
