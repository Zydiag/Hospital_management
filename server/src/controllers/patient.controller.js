import { apiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { hashPassword } from '../utils/hashPassword.js';
import { generateAccessAndRefreshToken } from '../utils/tokenGenerate.js';
import pkg from 'pg';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { Router } from 'express';
import bcrypt from 'bcrypt';
const { Client } = pkg;
const prisma = new PrismaClient();
const router = Router();

// // Function to generate a refresh token
// const generateRefreshToken = (user) => {
//   return jwt.sign(
//     { userId: user.id },
//     process.env.REFRESH_TOKEN_SECRET,
//     { expiresIn: '7d' } // Refresh token valid for 7 days
//   );
// };

//patient sets up profile
export const profilepatient = asyncHandler(async (req, res) => {
  console.log('you are inside patient profile creation');

  const { armyNo, dob, firstName, password } = req.body;
  console.log('step1');
  if (!armyNo || !password || !dob || !firstName) {
    throw new apiError(501, 'all feilds are required');
  }
  console.log('step2');
  const user = await prisma.User.findFirst({ where: { armyNo, role: 'PATIENT' } });
  if (!user) {
    throw new apiError(404, 'Access Denied/User is not registered by doctor');
  }
  console.log('step3');
  if (user.password != null) {
    res.json(new ApiResponse(200, user, 'user has signed up already'));
  }
  console.log(user);
  if (user.password == null) {
    // Hash password
    const hashedPassword = await hashPassword(password);
    const parsedDob = new Date(dob);
    //save in database
    const newUser = await prisma.User.update({
      where: {
        armyNo,
      },
      data: {
        dob: parsedDob,
        firstName: firstName,
        password: hashedPassword,
      },
    });
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(newUser);

    await prisma.User.update({
      where: {
        armyNo,
      },
      data: { refreshToken },
    });

    //cookies ke liya hai , options for which cookie to be sent
    const options = {
      httpOnly: true,
      secure: true,
    };
    console.log(`accessToken, refreshToken`);
    return res
      .status(200)
      .cookie('refreshToken', refreshToken, options)
      .cookie('accessToken', accessToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken,
          },
          'User singup in successfully'
        )
      );
  }
});

//patient login
export const loginpatient = asyncHandler(async (req, res) => {
  const { armyNo, password } = req.body;
  const user = await prisma.User.findFirst({
    where: {
      armyNo: armyNo,
      role: 'PATIENT',
    },
  });

  const isCorrect = await bcrypt.compare(password, user.password);
  if (!isCorrect) {
    throw new apiError(401, 'Incorrect password');
  }
  if (!user) {
    throw new apiError(404, 'User not found');
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user);

  await prisma.User.update({
    where: {
      armyNo,
    },
    data: { refreshToken },
  });
  console.log('step 4');
  //cookies ke liya hai , options for which cookie to be sent
  const options = {
    httpOnly: true,
    secure: true,
  };
  console.log(`accessToken, refreshToken`);
  return res
    .status(200)
    .cookie('refreshToken', refreshToken, options)
    .cookie('accessToken', accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user,
          accessToken,
          refreshToken,
        },
        'User logged in successfully'
      )
    );
});

// User Logout
export const logoutPatient = asyncHandler(async (req, res) => {
  // console.log(`req.user.id: ${req.user.id}`);

  await prisma.User.update({
    where: {
      id: req.user.id,
    },
    data: {
      refreshToken: null,
    },
  });
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie('refreshToken', options)
    .clearCookie('accessToken', options)
    .json(new ApiResponse(200, {}, 'User(patient) logout successfully'));
});

//perosnal-info-section1-patient
export const getpersonalinfo = asyncHandler(async (req, res) => {
  console.log('we are inside getpersonalinfo route');
  const armyNo = req.user.armyNo;

  const user = await prisma.User.findFirst({
    where: {
      armyNo: armyNo,
      role: 'PATIENT',
    },
    select: {
      armyNo: true,
      firstName: true,
      lastName: true,
      middleName: true,
      unit: true,
      dob: true,
    },
  });
  if (!user) {
    throw new apiError(404, 'user not found');
  }

  res.json(new ApiResponse(200, user, 'user personal info:'));
});

//read-health-record
export const getHealthRecord = asyncHandler(async (req, res) => {
  console.log('You are inside getHealthRecord Route');

  const armyNo = req.user.armyNo;
  const { date } = req.body;
  const user = await prisma.User.findFirst({
    where: {
      armyNo: armyNo,
      role: 'PATIENT',
    },
  });
  if (!user) {
    throw new apiError(404, 'user not found');
  }
  const healthId = user.id;
  const patient = await prisma.Patient.findFirst({
    where: {
      userId: healthId,
    },
  });
  if (!patient) {
    throw new apiError(404, 'Patient not found');
  }
  const health = await prisma.Medical.findFirst({
    where: {
      patientId: patient.id,
      updatedAt: new Date(date),
    },
    select: {
      heightCm: true,
      weightKg: true,
      BMI: true,
      chest: true,
      waist: true,
      bloodPressure: true,
    },
  });
  if (!health) {
    throw new apiError(404, 'Date does not exist in record');
  }
  res.json(new ApiResponse(200, health, 'Health record:-'));
});

//Read personal medical history
export const getPersonalMedicalHistory = asyncHandler(async (req, res) => {
  console.log('you are inside Personal Medical History Route');
  const { date } = req.body;
  const armyNo = req.user.armyNo;
  const user = await prisma.User.findFirst({
    where: {
      armyNo: armyNo,
      role: 'PATIENT',
    },
  });

  if (!user) {
    throw new apiError(404, 'user not found');
  }

  const userId = user.id;
  const patient = await prisma.Patient.findFirst({
    where: {
      userId: userId,
    },
  });

  if (!patient) {
    throw new apiError(404, 'Patient not found');
  }

  const patientId = patient.id;
   const treat = await prisma.treatment.findMany({
      where: {
        patientId,
        createdAt:new Date(date),
      },
      select: {
       diagnosis:true,
       description:true,
      },
    });
     const parseddescription=JSON.parse(description);
     const info ={
      diagnosis:treat.diagnosis,
      note:parseddescription.note,
      medicationName:parseddescription.medicationName,
      knownAllergies:parseddescription.knownAllergies,
      miscellaneous:parseddescription.miscellaneous,
     }

  if (!treat) {
    throw new apiError(404, 'Date is not present in record');
  }
  res.json(new ApiResponse(200, treat, 'Treatment Record:'));
});

//Read Family History
export const getFamilyHistory = asyncHandler(async (req, res) => {
  console.log('you are inside familyhistory route');
  const { date } = req.body;
  const armyNo = req.user.armyNo;
  const user = await prisma.User.findFirst({
    where: {
      armyNo: armyNo,
    },
  });

  if (!user) {
    throw new apiError(404, 'user not found');
  }

  const userId = user.id;
  console.log(userId);
  const patient = await prisma.Patient.findFirst({
    where: {
      userId: userId,
    },
  });
  if (!patient) {
    throw new apiError(404, 'Patient not found');
  }

  const family = await prisma.familyHistory.findFirst({
    where: {
      patientId: patient.id,
      createdAt: date,
    },
    select: {
      hypertension: true,
      diabetesMellitus: true,
      anyUnnaturalDeath: true,
      otherSignificantHistory: true,
    },
  });

  if (!family) {
    throw new apiError(404, 'Date does not exist');
  }
  res.json(new ApiResponse(200, family, 'FamilyHistory:'));
});

// AME Report
export const getAmeReports = asyncHandler(async (req, res) => {
  const { date } = req.body;
  const armyNo = req.user.armyNo;

  // Find the user by army number
  const user = await prisma.User.findFirst({
    where: { armyNo, role: 'PATIENT' },
    select: { id: true },
  });

  // If user not found, throw an error
  if (!user) {
    throw new apiError(404, 'User not found');
  }
  const patient = await prisma.Patient.findFirst({
    where: {
      userId: user.id,
    },
  });

  // Find all AME, AME2, and PME test reports associated with the user
  const ameReports = await prisma.AME.findMany({
    where: { patientId: patient.id, createdAt: new Date(date) },
  });
  console.log(ameReports);

  // If no reports found, return an empty array
  if (!ameReports) {
    return res.json(new ApiResponse(404, [], 'No test reports found'));
  }
 const parseddescription=JSON.parse(ameReports.description);
  const info ={
    bloodHb:parseddescription.bloodHb,
    TLC:parseddescription.TLC,
    DLC:parseddescription.DLC,
    urineRE:parseddescription.urineRE,
    urineSpGravity:parseddescription.urineSpGravity,
  }
  // Return all the test reports
  res.json(new ApiResponse(200, info, 'Ame test reports retrieved successfully'));
});

// AME1 Report
export const getAme1Reports = asyncHandler(async (req, res) => {
  const { date } = req.body;
  const armyNo = req.user.armyNo;

  // Find the user by army number
  const user = await prisma.User.findFirst({
    where: { armyNo, role: 'PATIENT' },
    select: { id: true },
  });

  // If user not found, throw an error
  if (!user) {
    throw new apiError(404, 'User not found');
  }
  const patient = await prisma.Patient.findFirst({
    where: {
      userId: user.id,
    },
  });
  // Find all AME, AME2, and PME test reports associated with the user
  const ameReports = await prisma.AME1.findMany({
    where: { patientId: patient.id, createdAt: new Date(date) },
  });
  console.log(ameReports);

  // If no reports found, return an empty array
  if (!ameReports) {
    return res.json(new ApiResponse(404, [], 'No test reports found'));
  }
const parseddescription=JSON.parse(ameReports.description);
  const info={
    bloodHb:parseddescription.bloodHb,
    TLC:parseddescription.TLC,
    DLC:parseddescription.DLC,
    urineRE:parseddescription.urineRE,
    urineSpGravity:parseddescription.urineSpGravity,
    bloodSugarFasting:parseddescription.bloodSugarFasting,
    bloodSugarPP:parseddescription.bloodSugarPP,
    restingECG:parseddescription.restingECG,
  }
  // Return all the test reports
  res.json(new ApiResponse(200, info, 'Ame1 test reports retrieved successfully'));
});

export const getPmeReports = asyncHandler(async (req, res) => {
  const { date } = req.body;
  const armyNo = req.user.armyNo;

  // Find the user by army number
  const user = await prisma.User.findFirst({
    where: { armyNo, role: 'PATIENT' },
    select: { id: true },
  });

  // If user not found, throw an error
  if (!user) {
    throw new apiError(404, 'User not found');
  }
  const patient = await prisma.Patient.findFirst({
    where: {
      userId: user.id,
    },
  });
  // Find all AME, AME2, and PME test reports associated with the user
  const ameReports = await prisma.PME.findMany({
    where: { patientId: patient.id, createdAt: new Date(date) },
  });
  console.log(ameReports);

  // If no reports found, return an empty array

  if (!ameReports) {
    return res.json(new ApiResponse(404, [], 'No test reports found'));
  }
   const parseddescription=JSON.parse(ameReports.description);
  const info={
    bloodHb:parseddescription.bloodHb,
    TLC:parseddescription.TLC,
    DLC:parseddescription.DLC,
    urineRE:parseddescription.urineRE,
    urineSpGravity:parseddescription.urineSpGravity,
    bloodSugarFasting:parseddescription.bloodSugarFasting,
    bloodSugarPP:parseddescription.bloodSugarPP,
    restingECG:parseddescription.restingECG,
    uricAcid:parseddescription.uricAcid,
    urea:parseddescription.urea,
    creatinine:parseddescription.creatinine,
    cholesterol:parseddescription.cholesterol,
    lipidProfile:parseddescription.lipidProfile,
    xrayChestPA:parseddescription.xrayChestPA,
  }
  // Return all the test reports
  res.json(new ApiResponse(200, info, 'Pme test reports retrieved successfully'));
});
// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
};
