class ApiResponse {
  /**
   * Creates a standard API response object.
   *
   * @param {number} statusCode - The HTTP status code for the response.
   * @param {any} data - The payload/data to be sent.
   * @param {string} [message='Success'] - A descriptive message for the response.
   */
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400; // Success is true for status codes in the 2xx range
  }
}

export default ApiResponse;
