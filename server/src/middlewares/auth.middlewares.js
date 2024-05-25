import { APIError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import db from '../lib/db.js';
import Jwt from 'jsonwebtoken';

export const verifyJwt = asyncHandler(async (req, _, next) => {
  try {
    const token = req.cookies?.refreshToken || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new APIError(400, 'Unauthorized request');
    }
    const decodedToken = Jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
   
    const user = await db.user.findUnique({
      where: {
        id: decodedToken.id,
      },
    });
    if (!user) {
      throw new APIError(401, 'invalid Access Token');
    }
    req.user = user;
    next();
  } catch (error) {
    throw new APIError(401, error?.message || 'Invalid access token');
  }
});

export const authorizeDoctor = (req, res, next) => {
  if (req.user.role !== 'DOCTOR') {
    // return next(new APIError(HttpStatusCode.FORBIDDEN, 'Access denied'));
    return next(new APIError(401, 'Access denied'));
  }
  next();
};

export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    // return next(new APIError(HttpStatusCode.FORBIDDEN, 'Access denied'));
    return next(new APIError(401, 'Access denied'));
  }
  next();
};
