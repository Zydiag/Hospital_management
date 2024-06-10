import { apiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import db from '../lib/db.js';
import Jwt from 'jsonwebtoken';

export const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new apiError(400, 'Unauthorized request');
    }
    const decodedToken = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // console.log('decodedToken from auth middleware: ', decodedToken);

    const user = await db.user.findUnique({
      where: {
        id: decodedToken.id,
      },
    });
    if (!user) {
      console.error('error is from here', user);
      throw new apiError(401, 'invalid Access Token');
    }
    req.user = user;
    next();
  } catch (error) {
    throw new apiError(401, error?.message || 'Invalid access token');
  }
});

export const authorizeDoctor = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'DOCTOR') {
    let doctor = await db.doctor.findUnique({
      where: {
        userId: req.user.id,
      },
    });
    if (doctor.status !== 'APPROVED') {
      return next(new apiError(401, 'Access denied'));
    }
  }
  next();
});

export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    // return next(new APIError(HttpStatusCode.FORBIDDEN, 'Access denied'));
    return next(new apiError(401, 'Access denied'));
  }
  next();
};

export const authorizePatientOrDoctor = (req, res, next) => {
  console.log('req.user.role', req.user.role);
  if (req.user.role !== 'PATIENT' && req.user.role !== 'DOCTOR') {
    // return next(new APIError(HttpStatusCode.FORBIDDEN, 'Access denied'));
    return next(new apiError(401, 'Access denied'));
  }
  next();
};
