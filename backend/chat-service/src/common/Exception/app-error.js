export default class AppError extends Error {
  constructor(message, code = 500) {
    super(message);
    this.code = code;
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }
}