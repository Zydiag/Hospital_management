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
    const{armyNo,password,confirmpassword}=req.body;
    if(!armyNo||!password||!confirmpassword){
      res.send("ArmyNo,password required");
    }
    if(password!=confirmpassword){
      res.send("Password doesn't match");
    }
    const user =await prisma.User.findFirst({where:{armyNo}});
    if(user.refreshToken==null&&user.password!=null){
      res.send("user has already signed up, please go to login page");
    }
    if(user.refreshToken==null&&user.password==null){
      res.send("access denied");
    }
    console.log(user);
    if(!user){
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
        console.log('Updating user...');// Debugging statement
        
        const used=await prisma.User.update({
          where: { armyNo:armyNo },
          data: {
            refreshToken:null,
           password: hashedPassword,
          }
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
      }}

});
//login patient
export const loginpatient = asyncHandler(async(req,res)=>{
    console.log("you are inside login system of patient");
    const {armyNo, password}=req.body;
    const user=await prisma.User.findUnique({
        where:{
           armyNo:armyNo     
        }
    })
    bcrypt.compare(password, user.password, function(err, result) {
      if (err) {
        res.send("Password is incorrect");
      } else if(result) {
        res.json(user);
      } 
      else{
        res.send("password is incorrect");}
    });
});
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
      unit:true
    }
  })
  if(!user){
    res.send("date is not present in record");
  }

  res.json(
    user,
  )

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
  const healthId=user.id;
  const patient=await prisma.Patient.findFirst({
    where:{
      userId:healthId
    }
  })
  if(!patient){
    res.send("user is not patient");
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
    res.send("date does not exist in record");
  }
  res.json(health);
});
//Read personal medical history
export const getPersonalMedicalHistory=asyncHandler(async(req,res)=>{
  console.log("you are inside Personal Medical History Route");
  const {armyNo,date}=req.body;
  const user =await prisma.User.findFirst({
    where:{
      armyNo:armyNo,
    }
  })
  const userId=user.id;
  const patient=await prisma.Patient.findFirst({
    where:{
      userId:userId,
    }
  })
  if(!patient){
    res.send("user is not patient");
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
       medicationName:true
    }
  })
  if(!treat){
    res.send("date is not present in database");
  }
  res.json(treat);
})

//Read Family History
export const getFamilyHistory=asyncHandler(async(req,res)=>{
  console.log("you are inside familyhistory route");
  const {armyNo,date}=req.body;
  const user =await prisma.User.findFirst({
   where:{
    armyNo:armyNo
   }
  })
  const userId=user.id;
  console.log(userId);
  const patient =await prisma.Patient.findFirst({
    where:{
      userId:userId
    }
  })
  if(!patient){
    res.send("user is not a patient");
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
    res.send("date does not exist");
  }
  res.json(family);

});

export const getAllTestReports = asyncHandler(async (req, res) => {
  const { armyNo,date } = req.body;

  // Find the user by army number
  const user = await prisma.User.findFirst({
    where: { armyNo },
    select: { id: true },
  });

  // If user not found, throw an error
  if (!user) {
   res.send("user not found");
  }
 const patient=await prisma.Patient.findFirst({
  where:{
    userId:user.id,
  }
 })
 if(!patient){
  res.send("user is not a patient");
 }
  // Find all AME, AME2, and PME test reports associated with the user
  const ameReports = await prisma.AME.findMany({
    where: {patientId:patient.id,createdAt:new Date(date)},
  });
  console.log(ameReports);
  const ame2Reports = await prisma.AME2.findMany({
    where: {patientId:patient.id,createdAt:new Date(date)},
  });
  console.log(ame2Reports);
  const pmeReports = await prisma.PME.findMany({
    where: {patientId:patient.id,createdAt:new Date(date)},
  });
  console.log(pmeReports);
  // Combine all reports into a single array
  const allReports = [...ameReports, ...ame2Reports, ...pmeReports];

  // If no reports found, return an empty array
  if (!allReports || allReports.length === 0) {
    return res.json("NO TEST REPORT FOUND");
  }

  // Return all the test reports
  res.json(allReports);
});

// Error handling middleware
export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
    });
  };
