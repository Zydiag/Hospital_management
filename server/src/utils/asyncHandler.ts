import { NextFunction } from 'express';
// Async handler function with error handling middleware
const asyncHandler = <T = any>(requestHandler: (req: Request, res: Response, next: NextFunction) => Promise<T>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await requestHandler(req, res, next);
      return result; // Explicitly return the result
    } catch (err) {
      return next(err); // Pass error to next middleware
    }
  };
};

// Export the asyncHandler function
export { asyncHandler };
