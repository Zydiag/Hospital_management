import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { hashPassword } from '../utils/hashPassword.js';
import pkg from 'pg';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { Router } from 'express';
import bcrypt from 'bcrypt';
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
export const profilepatient = async (req, res) => {
  console.log('you are inside patient profile creation');
  console.log('REFRESH_TOKEN_SECRET:', process.env.REFRESH_TOKEN_SECRET);
  const { armyNo, password, confirmpassword } = req.body;
  if (!armyNo || !password || !confirmpassword) {
    res.send('ArmyNo,password required');
  }
  if (password != confirmpassword) {
    res.send("Password doesn't match");
  }
  const user = await prisma.user.findFirst({ where: { armyNo } });
  console.log(user);
  if (!user) {
    return res.status(400).send('Invalid army number or profile already set up');
  }
  try {
    console.log('User refresh token:', user.refreshToken);
    // Debugging statement
    jwt.verify(user.refreshToken, process.env.REFRESH_TOKEN_SECRET);

    console.log('Refresh token verified successfully'); // Debugging statement
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    console.log(armyNo);

    console.log('Password hashed successfully');
    console.log('Updating user...'); // Debugging statement
    const use = await prisma.user.findUnique({
      where: { armyNo },
    });
    console.log(use);

    const used = await prisma.user.update({
      where: { armyNo: armyNo },

      data: {
        refreshToken: null,
        password: hashedPassword,
      },
    });
    console.log('User updated successfully');
    res.send('Profile set up successfully');
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).send('Refresh token expired');
    } else if (error.name === 'JsonWebTokenError') {
      res.status(500).send('Invalid refresh token');
    } else {
      res.status(500).send('Internal server error ');
    }
  }
};
//login patient
export const loginpatient = async (req, res) => {
  console.log('you are inside login system of patient');
  const { armyNo, password } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      armyNo: armyNo,
    },
  });
  bcrypt.compare(password, user.password, function (err, result) {
    if (err) {
      res.send('Password is incorrect');
    } else if (result) {
      res.json(user);
    } else {
      res.send('password is incorrect');
    }
  });
};
//perosnal-info-section1-patient
export const getpersonalinfo=async(req,res)=>{
  console.log("we are inside getpersonalinfo route");
  const {armyNo,date}=req.body;
  if(!date){
    res.send("date is missing");
  }
  
  const user=await prisma.user.findFirst({
    where:{
      armyNo:armyNo,
      date:date,
    },
    select:{
      armyNo:true,
      firstName:true,
      lastName:true,
      middleName:true,
      unit:true
    }
  })
  if(!user){
    res.send("date is not present in record");
  }

  res.json(
    user,
  )

};

//read-health-record
export const getHealthRecord=async(req,res)=>{
  console.log("You are inside getHealthRecord Route");
  const {armyNo, date}=req.body;
  const user =await prisma.user.findUnique({
    where:{
      armyNo:armyNo,
    }
  })
  const healthId=user.id;
  const patient=await prisma.patient.findUnique({
    where:{
      userId:healthId
    }
  })
  const health=await prisma.medical.findFirst({
    where:{
      patientId:patient.id,
      date:date,
    },
    select:{
     heightCm:true,
     weightKg:true,
     BMI:true,
     chest:true,
     waist:true,
     bloodPressure:true
    }
  })
  if(!health){
    res.send("date does not exist in record");
  }
  res.json(health);
}
// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
};
