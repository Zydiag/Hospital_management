// Class implementing the ApiResponse interface
class ApiResponse {
  constructor(statusCode, data = null, message, success = true) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

// Export the ApiResponse class
export { ApiResponse };
