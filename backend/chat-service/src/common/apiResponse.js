export default class ApiResponse {
  constructor({
    code = 200,
    message = 'SUCCESS',
    data = null,
  } = {}) {
    this.timestamp = new Date().toISOString();
    this.code = code;
    this.message = message;
    this.data = data;
  }

  static success(data) {
    return new ApiResponse({
      code: 200,
      message: 'SUCCESS',
      data,
    });
  }

  static error({ message = 'ERROR', code = 500 }) {
    return new ApiResponse({
      code,
      message,
    });
  }
}
