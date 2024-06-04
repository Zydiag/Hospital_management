import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import prisma from '../lib/db.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { apiError } from '../utils/apiError.js';
import Jwt from 'jsonwebtoken';

import { verifyJwt } from '../middlewares/auth.middlewares.js';
import { access } from 'fs';

const router = Router();

const refreshAccessToken = asyncHandler(async (req, res) => {
  let accessToken = req.header('Authorization')?.replace('Bearer ', '') || req.cookies?.accessToken;
  let refreshToken =
    req.cookies?.refreshToken || req.header('Authorization')?.replace('Bearer ', '');

  if (!accessToken) {
    throw new apiError(401, 'Access token is missing');
  }
  Jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    console.log('refresh route error', err?.name, decoded);
    if (err && err.name === 'TokenExpiredError') {
      console.log('access token expired');
      // Access token expired
      if (!refreshToken) {
        throw new apiError(401, 'Refresh token is missing');
      }
      Jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decodedRefresh) => {
        // console.log('refresh token verified bro...😊');
        if (err) {
          throw new apiError(403, 'Refresh token is invalid or expired');
        }
        const user = await prisma.user.findUnique({
          where: {
            id: decodedRefresh.id,
          },
        });
        let newAccessToken = Jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        });
        // console.log('earlier access token...😊😊😊😊', accessToken);
        // console.log('access token generated yayy...😊😊', newAccessToken);
        accessToken = newAccessToken;
        req.user = user;

        res
          .cookie('accessToken', newAccessToken, { httpOnly: true, secure: true })
          .json(new ApiResponse(200, { accessToken }));
      });
    } else if (err) {
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

router.route('/current-user-profile').get(verifyJwt, getCurrentUser);
router.route('/refresh-access-token').post(refreshAccessToken);

export default router;
