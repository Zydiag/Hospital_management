import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import prisma from '../lib/db.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { apiError } from '../utils/apiError.js';
import Jwt from 'jsonwebtoken';

const router = Router();

const refreshAccessToken = asyncHandler(async (req, res) => {

  let accessToken = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
  let refreshToken =
    req.cookies?.refreshToken || req.header('Authorization')?.replace('Bearer ', '');

  if (!accessToken) {
    throw new apiError(401, 'Access token is missing');
  }

  Jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err && err.name === 'TokenExpiredError') {
      // Access token expired
      if (!refreshToken) {
        throw new apiError(401, 'Refresh token is missing');
      }
      // Verify refresh token
      Jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decodedRefresh) => {
        if (err) {
          throw new apiError(403, 'Refresh token is invalid or expired');
        }
        const user = await prisma.user.findUnique({
          where: {
            id: decodedRefresh.id,
          },
        });
        
        // Generate new access token
        let newAccessToken = Jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '10s',
        });
        accessToken = newAccessToken;
        req.user = user;

        res
          .cookie('accessToken', newAccessToken, { httpOnly: true, secure: true })
          .json(new ApiResponse(200, { accessToken }));

      });
    } else if (err) {
      // Other errors (invalid token, etc.)
      throw new apiError(403, err || 'Access token is invalid');
    } else {
      const user = await prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
      }); 
      if (!user) {
        throw new apiError(401, 'invalid Access Token');
      }
      req.user = user;
      res.json(new ApiResponse(200, {}));
    }
  });
});

// Get Current User
const getCurrentUser = asyncHandler(async (req, res) => {
  console.log(`req.user.id: ${req.user.id}`);
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
  });
  return res.status(200).json(new ApiResponse(200, user, 'User fetched successfully'));
});

router.route('/current-user-profile').get(getCurrentUser);
router.route('/refresh-access-token').post(refreshAccessToken);

export default router;
