import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { hashPassword } from '../utils/hashPassword.js';
import pkg from 'pg';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { Router } from 'express';

const { Client } = pkg;
const prisma = new PrismaClient();
const router = Router();

// Function to generate a refresh token
const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' } // Refresh token valid for 7 days
  );
};
//patient sets up profile
export const profilepatient = async(req,res)=>{
    console.log("you are inside patient profile creation");
    const{armyNo,password}=req.body;
    const user =await prisma.user.findUnique({where:{armyNo}});
    if(!user||user.isSetupComplete){
        return res.status(400).send('Invalid army number or profile already set up');
    }
    try {
        jwt.verify(user.refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
          where: { armyNumber },
          data: {
           password: hashedPassword,
            refreshToken: null,
            isSetupComplete: true
          }
        });
    
        res.send('Profile set up successfully');
      } catch (error) {
        res.status(400).send('Invalid refresh token');
      }

}
//login patient
export const loginpatient = async(req,res)=>{
    console.log("you are inside login system of patient");
    const {armyNo, password}=req.body;
    const user=await prisma.user.findUnique({
        where:{
            armyNo:armyNo,
            password:password
        }
    })
    if(!user){
        res.status(200).send("User not found");
    }
    res.json(user);
}
// Error handling middleware
export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
    });
  };
