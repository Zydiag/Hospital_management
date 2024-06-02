import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import prisma from '../lib/db.js';
import { ApiResponse } from '../utils/apiResponse.js';



const router = Router();
const refreshAccessToken = asyncHandler(async (req, res) => {
  let accessToken = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
  const refreshToken =
    req.cookies?.refreshToken || req.header('Authorization')?.replace('Bearer ', '');
  const jwt = require('jsonwebtoken');

  if (!accessToken) {
    return res.status(401).json({ message: 'Access token is missing' });
  }

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err && err.name === 'TokenExpiredError') {
      // Access token expired
      if (!refreshToken) {
        return res.status(403).json({ message: 'Refresh token is missing' });
      }

      // Verify refresh token
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decodedRefresh) => {
        if (err) {
          return res.status(403).json({ message: 'Refresh token is invalid or expired' });
        }
        const user = await prisma.user.findUnique({
          where: {
            id: decodedRefresh.id,
          },
        });
        // Generate new access token
        let newAccessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '10s',
        });
        accessToken = newAccessToken;
        // Optionally set the new access token in cookies or headers

        res
          .cookie('accessToken', newAccessToken, { httpOnly: true, secure: true })
          .json(new ApiResponse(200, { accessToken }));

        // res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true });

        req.user = user;
        next();
      });
    } else if (err) {
      // Other errors (invalid token, etc.)
      return res.status(403).json({ message: 'Access token is invalid' });
    } else {
      next();
    }
  });
});

// Get Current User
 const getCurrentUser = asyncHandler(async (req, res) => {
    console.log(`req.user.id: ${req.user.id}`);
    return res
      .status(200)
      .json(new ApiResponse(200, req.user.firstName, 'User fetched successfully'));
  });

  
router.route('/current-user-profile').get(getCurrentUser);
router.route('/refresh-access-token').post(refreshAccessToken);

export default router;