const HttpStatusCode = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
};

class BaseError extends Error {
  constructor(name, httpCode, description, isOperational) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;

    // Capture stack trace for debugging purposes
    Error.captureStackTrace(this);
  }
}

class APIError extends BaseError {
  constructor(name, httpCode = HttpStatusCode.INTERNAL_SERVER, isOperational = true, description = 'internal server error') {
    super(name, httpCode, description, isOperational);
  }
}

export { BaseError, APIError };

// export enum HttpStatusCode {
//   OK = 200,
//   BAD_REQUEST = 400,
//   NOT_FOUND = 404,
//   INTERNAL_SERVER = 500,
// }
//
// // Custom error class extending the built-in Error class
// class BaseError extends Error {
//   public readonly name: string;
//   public readonly httpCode: HttpStatusCode;
//   public readonly isOperational: boolean;
//
//   constructor(name: string, httpCode: HttpStatusCode, description: string, isOperational: boolean) {
//     super(description);
//     Object.setPrototypeOf(this, new.target.prototype);
//
//     this.name = name;
//     this.httpCode = httpCode;
//     this.isOperational = isOperational;
//
//     // Capture stack trace for debugging purposes
//     Error.captureStackTrace(this);
//   }
// }
//
// class APIError extends BaseError {
//   constructor(
//     name: string,
//     httpCode: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER,
//     isOperational: boolean = true,
//     description: string = 'internal server error'
//   ) {
//     super(name, httpCode, description, isOperational);
//   }
// }
//
// export {BaseError, APIError}
