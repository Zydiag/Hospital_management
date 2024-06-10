import { apiError } from '../utils/apiError.js';

const errorHandler = (err, req, res, next) => {
  if (err instanceof apiError) {
    console.error(err);
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined, // Only show stack in development
    });
  }

  // Handle other types of errors (if any)
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    errors: [],
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export default errorHandler;
