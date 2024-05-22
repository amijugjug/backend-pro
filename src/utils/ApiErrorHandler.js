/**
 * @class ApiErrorHandler
 * @description Custom error class for API errors.
 * @extends Error
 */
class ApiErrorHandler extends Error {
  /**
   * Constructor for ApiErrorHandler.
   *
   * @param {number} statusCode - The HTTP status code to be returned with the error.
   * @param {string} [message="Something went wrong !!!"] - The error message to be returned.
   * @param {Array<string>} [errors=[]] - An array of additional error messages.
   * @param {string} [stack=""] - The stack trace to be returned with the error.
   */
  constructor(
    statusCode,
    message = "Something went wrong !!!",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    this.errors = errors;

    if (stack) this.stack = stack;
    else Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiErrorHandler;
