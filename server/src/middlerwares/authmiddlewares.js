import { APIError } from "../utils/apiError";
import {asyncHandler} from "../utils/asyncHandler";
import db from "../lib/db";
import Jwt from "jsonwebtoken";

export const verifyJwt = asyncHandler(async (req,_, next) => {
    try {
        const token = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ", "");
        if(!token)
        {
            throw new APIError(400,"Unauthorized request") 
        }
        const decodedToken= Jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user = await db.user.findUnique({
            where: {
              id: decodedToken.id,
            },
            select: {
              password: false,
              refreshToken: false,
            },
          });
        if(!user){
            throw new APIError(401,"invalid Access Token")
        }
        req.user = user;
        next()
    } catch (error) {
        throw new APIError(401, error?.message || "Invalid access token")
    }
});

export const authorizeDoctor = (req, res, next) => {
  if (req.user.role !== 'DOCTOR') {
    return next(new APIError(HttpStatusCode.FORBIDDEN, 'Access denied'));
  }
  next();
};

export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return next(new APIError(HttpStatusCode.FORBIDDEN, 'Access denied'));
  }
  next();
};
