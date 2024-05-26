import bcrypt from 'bcrypt';
import { asyncHandler } from '../utils/asyncHandler.js';
import { APIError } from './apiError.js';

export const hashPassword = asyncHandler(async (password) => {
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash password
    const hash = await bcrypt.hash(password, salt);

    return hash;
  } catch (error) {
    throw new APIError(500, error.message);
  }
});
