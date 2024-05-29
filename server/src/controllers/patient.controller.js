import { apiError } from '../utils/apiError.js';
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
export const profilepatient = asyncHandler(async(req,res)=>{
    console.log("you are inside patient profile creation");
    console.log('REFRESH_TOKEN_SECRET:', process.env.REFRESH_TOKEN_SECRET);
    const{armyNo,dob,firstName,password}=req.body;
    if(!armyNo||!password||!dob||!firstName){
      throw new apiError(HttpStatusCode.NOT_FOUND, 'all feilds are required');
    }
    const user =await prisma.User.findFirst({where:{armyNo,role:"PATIENT"}});
    if(!user){
      throw new apiError(HttpStatusCode.NOT_FOUND, 'Access Denied');
    }
    if(user.password!=null){
      res.json(new ApiResponse(HttpStatusCode.OK, user, 'user has signed up already'));
    }
    console.log(user);
    if(user.password==null){
      await prisma.User.update({
        data:{
          armyNo:armyNo,
          dob:dob,
          firstName:firstName,
          password:password,
        }
      })
    }
  
    
})

export const loginpatient=asyncHandler(async(req,res)=>{
  const {armyNo, password}=req.body;
  const user =await prisma.User.findFirst({
    where:{
      armyNo:armyNo,
      role:"PATIENT",
      password:password,
    }
  })
  if(!user){
    throw new apiError(HttpStatusCode.NOT_FOUND,'User not found');
  }
  res.json(new ApiResponse(HttpStatusCode.ok,user,'User Login Successful'));
})
//perosnal-info-section1-patient
export const getpersonalinfo=asyncHandler(async(req,res)=>{
  console.log("we are inside getpersonalinfo route");
  const {armyNo}=req.body;
  
  const user=await prisma.User.findFirst({
    where:{
      armyNo:armyNo,
      role:"PATIENT",
    },
    select:{
      armyNo:true,
      firstName:true,
      lastName:true,
      middleName:true,
      unit:true,
      dob:true,
    }
  })
   if(!user){
      throw new apiError(HttpStatusCode.NOT_FOUND, 'user not found');
    }

  res.json(new ApiResponse(HttpStatusCode.OK, user, 'user personal info:'));

});

//read-health-record
export const getHealthRecord=asyncHandler(async(req,res)=>{
  console.log("You are inside getHealthRecord Route");
  const {armyNo, date}=req.body;
  const user =await prisma.User.findFirst({
    where:{
      armyNo:armyNo,
      role:"PATIENT",
    }
  })
    if(!user){
      throw new apiError(HttpStatusCode.NOT_FOUND, 'user not found');
    }
  const healthId=user.id;
  const patient=await prisma.Patient.findFirst({
    where:{
      userId:healthId
    }
  })
  if(!patient){
    throw new apiError(HttpStatusCode.NOT_FOUND, 'Patient not found');
  }
  const health=await prisma.Medical.findFirst({
    where:{
      patientId:patient.id,
      updatedAt:new Date(date),
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
    throw new apiError(HttpStatusCode.NOT_FOUND, 'Date does not exist in record');
  }
  res.json(new ApiResponse(HttpStatusCode.OK, health, 'Health record:-'));
});
//Read personal medical history
export const getPersonalMedicalHistory=asyncHandler(async(req,res)=>{
  console.log("you are inside Personal Medical History Route");
  const {armyNo,date}=req.body;
  const user =await prisma.User.findFirst({
    where:{
      armyNo:armyNo,
      role:"PATIENT",
    }
  })
    if(!user){
      throw new apiError(HttpStatusCode.NOT_FOUND, 'user not found');
    }
  const userId=user.id;
  const patient=await prisma.Patient.findFirst({
    where:{
      userId:userId,
    }
  })
  if(!patient){
    throw new apiError(HttpStatusCode.NOT_FOUND, 'Patient not found');
  }
  const patientId=patient.id;
  const treat=await prisma.treatment.findFirst({
    where:{
      patientId:patientId,
      createdAt:new Date(date),
    },
    select:{
       diagnosis:true,
       note:true,
       medicationName:true,
       miscellaneous:true,
       knownAllergies:true,
    }
  })
  if(!treat){
    throw new apiError(HttpStatusCode.NOT_FOUND, 'Date is not present in record');
  }
  res.json(new ApiResponse(HttpStatusCode.OK, treat, 'Treatment Record:'));
});

//Read Family History
export const getFamilyHistory=asyncHandler(async(req,res)=>{
  console.log("you are inside familyhistory route");
  const {armyNo,date}=req.body;
  const user =await prisma.User.findFirst({
   where:{
    armyNo:armyNo
   }
  })
    if(!user){
      throw new apiError(HttpStatusCode.NOT_FOUND, 'user not found');
    }
  const userId=user.id;
  console.log(userId);
  const patient =await prisma.Patient.findFirst({
    where:{
      userId:userId
    }
  })
  if(!patient){
    throw new apiError(HttpStatusCode.NOT_FOUND, 'Patient not found');
  }
  const family=await prisma.familyHistory.findFirst({
    where:{
      patientId:patient.id,
      createdAt:date
    },
    select:{
      hypertension:true,
      diabetesMellitus :true,
      anyUnnaturalDeath:true,
      otherSignificantHistory:true
    }
  })
  if(!family){
    throw new apiError(HttpStatusCode.NOT_FOUND, 'Date does not exist');
  }
  res.json(new ApiResponse(HttpStatusCode.OK, family, 'FamilyHistory:'));

});

export const getAmeReports = asyncHandler(async (req, res) => {
  const { armyNo ,date} = req.body;

  // Find the user by army number
  const user = await prisma.User.findFirst({
    where: { armyNo ,role:"PATIENT"},
    select: { id: true },
  });

  // If user not found, throw an error
  if (!user) {
    throw new apiError(HttpStatusCode.NOT_FOUND, 'User not found');
  }
 const patient=await prisma.Patient.findFirst({
  where:{
    userId:user.id,
  }
 })
  // Find all AME, AME2, and PME test reports associated with the user
  const ameReports = await prisma.AME.findMany({
    where: {patientId:patient.id,createdAt:new Date(date)},
  });
  console.log(ameReports);

  // If no reports found, return an empty array
  if (!ameReports) {
    return res.json(new ApiResponse(HttpStatusCode.NOT_FOUND, [], 'No test reports found'));
  }

  // Return all the test reports
  res.json(new ApiResponse(HttpStatusCode.OK, ameReports, 'Ame test reports retrieved successfully'));
});

export const getAme1Reports = asyncHandler(async (req, res) => {
  const { armyNo ,date} = req.body;

  // Find the user by army number
  const user = await prisma.User.findFirst({
    where: { armyNo ,role:"PATIENT"},
    select: { id: true },
  });

  // If user not found, throw an error
  if (!user) {
    throw new apiError(HttpStatusCode.NOT_FOUND, 'User not found');
  }
 const patient=await prisma.Patient.findFirst({
  where:{
    userId:user.id,
  }
 })
  // Find all AME, AME2, and PME test reports associated with the user
  const ameReports = await prisma.AME1.findMany({
    where: {patientId:patient.id,createdAt:new Date(date)},
  });
  console.log(ameReports);

  // If no reports found, return an empty array
  if (!ameReports) {
    return res.json(new ApiResponse(HttpStatusCode.NOT_FOUND, [], 'No test reports found'));
  }

  // Return all the test reports
  res.json(new ApiResponse(HttpStatusCode.OK, ameReports, 'Ame1 test reports retrieved successfully'));
});

export const getPmeReports = asyncHandler(async (req, res) => {
  const { armyNo ,date} = req.body;

  // Find the user by army number
  const user = await prisma.User.findFirst({
    where: { armyNo ,role:"PATIENT"},
    select: { id: true },
  });

  // If user not found, throw an error
  if (!user) {
    throw new apiError(HttpStatusCode.NOT_FOUND, 'User not found');
  }
 const patient=await prisma.Patient.findFirst({
  where:{
    userId:user.id,
  }
 })
  // Find all AME, AME2, and PME test reports associated with the user
  const ameReports = await prisma.PME.findMany({
    where: {patientId:patient.id,createdAt:new Date(date)},
  });
  console.log(ameReports);

  // If no reports found, return an empty array
 
  if (!ameReports) {
    return res.json(new ApiResponse(HttpStatusCode.NOT_FOUND, [], 'No test reports found'));
  }

  // Return all the test reports
  res.json(new ApiResponse(HttpStatusCode.OK, ameReports, 'Pme test reports retrieved successfully'));
});
// Error handling middleware
export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
    });
  };
