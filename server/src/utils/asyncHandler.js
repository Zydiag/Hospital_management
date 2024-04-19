// Async handler function with error handling middleware
const asyncHandler = (requestHandler) => {
  return async (req, res, next) => {
    try {
      const result = await requestHandler(req, res, next);
      return result; // Explicitly return the result
    } catch (err) {
      return next(err); // Pass error to next middleware
    }
  };
};

export { asyncHandler };
