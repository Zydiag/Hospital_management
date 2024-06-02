import { apiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import db from '../lib/db.js';
import Jwt from 'jsonwebtoken';

export const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    // console.log(req.header('Authorization'));
    const refreshToken =
      req.cookies?.refreshToken || req.header('Authorization')?.replace('Bearer ', '');
    console.log('refreshToken:', refreshToken);
    const accessToken =
      req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
    console.log('accessToken:', accessToken);
    if (!refreshToken || !accessToken) {
      throw new apiError(400, 'Unauthorized request');
    }

    Jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err && err.name === 'TokenExpiredError') {
        // Access token expired
        console.log('Access token expired');

        // Verify refresh token
        Jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decodedRefresh) => {
          if (err) {
            return res.status(403).json({ message: 'Refresh token is invalid or expired' });
          }
          const user = await db.user.findUnique({
            where: {
              id: decodedRefresh.id,
            },
          });
          if (!user) {
            throw new apiError(401, 'invalid Access Token');
          }
          console.log('now we generate new access token');
          // Generate new access token
          const newAccessToken = Jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '10m',
          });

          // Optionally set the new access token in cookies or headers
          res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true });

          req.user = user;
          next();
        });
      } else if (err) {
        // Other errors (invalid token, etc.)
        return res.status(403).json({ message: 'Access token is invalid' });
      } else {
        // Access token is valid

        const decodedToken = Jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        const user = await db.user.findUnique({
          where: {
            id: decodedToken.id,
          },
        });
        if (!user) {
          throw new apiError(401, 'invalid Access Token');
        }
        req.user = user;
        next();
      }
    });
  } catch (error) {
    throw new apiError(401, `this is our eror ===> ${error.message}`);
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
export const authorizePatient = (req, res, next) => {
  if (req.user.role !== 'PATIENT') {
    // return next(new APIError(HttpStatusCode.FORBIDDEN, 'Access denied'));
    return next(new apiError(401, 'Access denied'));
  }
  next();
};
