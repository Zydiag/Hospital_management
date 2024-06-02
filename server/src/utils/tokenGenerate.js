import { apiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';
export const generateAccessAndRefreshToken = asyncHandler(async (user) => {
  try {
    const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
    const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log('error: ', error);
    throw new apiError(500, 'Something went wrong while generating access and refresh token');
  }
});

