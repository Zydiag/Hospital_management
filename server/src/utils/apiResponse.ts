// Interface for API response structure
interface ApiResponse {
  statusCode: number;
  data: any | null;
  message: string;
  success: boolean;
}

// Class implementing the ApiResponse interface
class ApiResponse implements ApiResponse {
  constructor(
    statusCode: number,
    data: any = null,
    message: string,
    success = true
  ) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

// Export the ApiResponse class
export { ApiResponse };
