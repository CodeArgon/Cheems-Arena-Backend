class APIError extends Error {
  constructor(message, statusCode) {
    super();
    this.message =
      message === "jwt malformed"
        ? "your session is expired. Please login again"
        : message;
    this.statusCode = statusCode ?? 500;
  }
}

export default APIError;