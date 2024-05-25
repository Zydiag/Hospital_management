// export const HttpStatusCode = {
//   OK: 200,
//   BAD_REQUEST: 400,
//   NOT_FOUND: 404,
//   INTERNAL_SERVER: 500,
// };

// class BaseError extends Error {
//   constructor(name, httpCode, description) {
//     super(description);
//     Object.setPrototypeOf(this, new.target.prototype);

//     this.name = name;
//     this.httpCode = httpCode;
//     // Capture stack trace for debugging purposes
//     Error.captureStackTrace(this);
//   }
// }

// class APIError extends BaseError {
//   constructor(
//     name,
//     httpCode = HttpStatusCode.INTERNAL_SERVER,
//     description = 'internal server error'
//   ) {
//     super(name, httpCode, description);
//   }
// }

// export { BaseError, APIError };

class APIError extends Error {
  constructor(
      stsatusCode,
      message= "something went wrong",
      errors=[],
      stack =''
  )
  {
      super(message);
      this.stsatusCode = stsatusCode;
      this.message = message;
      this.errors = this.errors;
      this.stack = stack;
      this.data = null;
      this.success = false;
      if(stack){
          this.stack = stack
      } else{
          Error.captureStackTrace(this, this.constructor)
      }
  }
}
export {APIError}