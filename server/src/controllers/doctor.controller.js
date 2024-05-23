import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { hashPassword } from '../utils/hashPassword.js';
import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { APIError, HttpStatusCode } from '../utils/apiError.js';
import jwt from 'jsonwebtoken';
import pkg from 'pg';
import 'dotenv/config';

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

// Create Doctor profile
const createDoctorProfile = asyncHandler(async (req, res) => {
  const {
    armyNo,
    unit,
    rank,
    firstName,
    middleName = '',
    lastName = '',
    email,
    mobileNo,
    dob,
    password,
  } = req.body;

  // Check if all fields are filled
  if (!armyNo || !unit || !rank || !firstName || !lastName || !dob || !password) {
    throw new APIError(HttpStatusCode.BAD_REQUEST, 'All fields are required to create a new user');
  }

  // Check if user already exists
  let existedDoctor = await prisma.user.findFirst({
    where: { armyNo },
  });
  if (existedDoctor) {
    throw new APIError(HttpStatusCode.BAD_REQUEST, 'Doctor already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user and store in database
  const user = await prisma.user.create({
    data: {
      armyNo,
      unit,
      rank,
      firstName,
      middleName,
      lastName,
      email,
      password: hashedPassword,
      mobileNo,
      dob: new Date(dob), // Assuming dob is provided as a string in 'YYYY-MM-DD' format
      role: 'DOCTOR', // Default role for this example
    },
  });

  const createdDoctor = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!user) {
    throw new APIError(HttpStatusCode.INTERNAL_SERVER_ERROR, 'Something went wrong while registering user');
  }

  // store doctor request in database 
  await prisma.request.create({
    data: {
      armyNo,
      firstName,
      lastName,
      unit,
      rank, 
    },
  });

  // Return response
  return res
    .status(200)
    .json(
      new ApiResponse(200, createdDoctor, 'Doctor created successfully but it is not verified yet')
    );
});

// login doctor
export const loginDoctor = asyncHandler(async (req, res) => {
  const { armyNo, password } = req.body;
  // check if all fields are filled
  if (!password || !armyNo) {
    throw new APIError(400, 'All fields are  required');
  }  
  const doctor = await prisma.user.findUnique({
    where: {
      armyNo: armyNo,
    },
  });
  if (!doctor) {
    throw new APIError(404, 'User(doctor) not found');
  }
  // check if password is correct
  const isCorrect = await bcrypt.compare(password, doctor.password);
  if (!isCorrect) {
    throw new APIError(401, 'Incorrect password');
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(doctor);
  await prisma.user.update({
    where: {
      id: doctor.id,
    },
    data: { refreshToken },
  });
  //cookies ke liya hai , options for which cookie to be sent
  const options = {
    httpOnly: true,
    secure: true,
  };
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
        'Doctor logged in successfully'
      )
    );
});

//  Doctor Logout
export const logoutAdmin = asyncHandler(async (req, res) => {
  await prisma.user.update({
    where: {
      id: req.user.id
    },
    data: {
      refreshToken: null
    }
  })
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "Doctor logout successfully"));
});


// Get Personal Info of patient by Army Number
export const getPersonalInfo = asyncHandler(async (req, res) => {
    const { unit, rank, firstName, middleName, lastName, email, mobileNo, dob } = req.body;
    const { armyNo } = req.body;

  if (!armyNo) {
    throw new APIError(HttpStatusCode.BAD_REQUEST, 'Army number is required');
  }

  let user = await prisma.user.findFirst({
    where: { armyNo },
  });

  if (!user) {
    // Validation for all required fields
    if (!unit || !rank || !firstName || !lastName || !dob) {
      throw new APIError(HttpStatusCode.BAD_REQUEST, 'All fields are required to create a new user');
    }

    // Generate a refresh token for the new user
    const refreshToken = generateRefreshToken({ id: armyNo });

    user = await prisma.user.create({
      data: {
        armyNo,
        unit,
        rank,
        firstName,
        middleName,
        lastName,
        email,
        mobileNo,
        dob: new Date(dob), // Assuming dob is provided as a string in 'YYYY-MM-DD' format
        role: 'PATIENT', // Default role for this example
        refreshToken,
      },
    });

    await prisma.patient.create({
      data: { userId: user.id },
    });
  } else if (!user.refreshToken) {
    const refreshToken = generateRefreshToken(user);
    user = await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });
  }

  res.cookie('refreshToken', user.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Ensure the cookie is only sent over HTTPS in production
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json(new ApiResponse(HttpStatusCode.OK, user, 'User retrieved successfully'));
});

// Update Personal Info
export const updatePersonalInfo = asyncHandler(async (req, res) => {
  const { armyNo, middleName, lastName, email, mobileNo } = req.body;

  const existingUser = await prisma.user.findFirst({
    where: { armyNo },
  });

  if (!existingUser) {
    throw new APIError(HttpStatusCode.NOT_FOUND, 'User Not Found');
  }

  const updatedUser = await prisma.user.update({
    where: { id: existingUser.id },
    data: { middleName, lastName, email, mobileNo },
  });

  res.json(new ApiResponse(HttpStatusCode.OK, updatedUser, 'Personal info updated successfully'));
});

// Read Health Record
export const getHealthRecord = asyncHandler(async (req, res) => {
  const { armyNo } = req.body;

  const user = await prisma.user.findFirst({
    where: { armyNo },
  });

  if (!user) {
    throw new APIError(HttpStatusCode.NOT_FOUND, 'User not found');
  }

  const patient = await prisma.patient.findFirst({
    where: { userId: user.id },
  });

  if (!patient) {
    throw new APIError(HttpStatusCode.NOT_FOUND, 'Patient not found');
  }

  const medicalRecord = await prisma.medical.findMany({
    where: { patientId: patient.id },
  });

  res.json(new ApiResponse(HttpStatusCode.OK, medicalRecord, 'Health records retrieved successfully'));
});

// Update Health Record
export const updateHealthRecord = asyncHandler(async (req, res) => {
  const {
    armyNo,
    heightCm,
    weightKg,
    chest,
    BMI,
    waist,
    bloodPressure,
    disabilities,
    bloodGroup,
    onDrug,
    date,
  } = req.body;

  const patient = await prisma.patient.findFirst({
    where: {
      user: { armyNo },
    },
    select: { id: true },
  });

  if (!patient) {
    throw new APIError(HttpStatusCode.NOT_FOUND, 'Patient not found with the provided army number');
  }

  const newMedicalRecord = await prisma.medical.create({
    data: {
      heightCm,
      weightKg,
      chest,
      BMI,
      waist,
      bloodPressure,
      disabilities,
      bloodGroup,
      onDrug,
      date,
      patientId: patient.id,
    },
  });

  res.json(new ApiResponse(HttpStatusCode.OK, newMedicalRecord, 'Medical record created successfully'));
});

// Read Personal Medical History
export const getTreatmentRecord = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const patient = await prisma.patient.findFirst({
    where: { userId },
    select: { id: true },
  });

  if (!patient) {
    throw new APIError(HttpStatusCode.NOT_FOUND, 'Patient not found');
  }

  const treatmentRecords = await prisma.treatment.findMany({
    where: { patientId: patient.id },
    include: { medication: true },
  });

  const descriptions = treatmentRecords.map(record => JSON.parse(record.description));

  res.json(new ApiResponse(HttpStatusCode.OK, { treatmentRecords, descriptions }, 'Treatment records retrieved successfully'));
});

// Update Treatment Records
export const updateTreatmentRecord = asyncHandler(async (req, res) => {
  const {
    armyNo,
    presentingComplaints,
    diagnosis,
    treatmentGiven,
    miscellaneous,
  } = req.body;

  const patient = await prisma.patient.findFirst({
    where: { user: { armyNo } },
    select: { id: true },
  });

  if (!patient) {
    throw new APIError(HttpStatusCode.NOT_FOUND, 'Patient not found');
  }

  const description = JSON.stringify({
    presentingComplaints,
    diagnosis,
    treatmentGiven,
    miscellaneous,
  });

  const newTreatment = await prisma.treatment.create({
    data: {
      description,
      patientId: patient.id,
    },
  });

  res.json(new ApiResponse(HttpStatusCode.OK, newTreatment, 'Treatment record created successfully'));
});

// Read Family History
export const getFamilyHistory = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    throw new APIError(HttpStatusCode.BAD_REQUEST, 'User ID must be provided.');
  }

  const patient = await prisma.patient.findFirst({
    where: { userId },
    select: { id: true },
  });

  if (!patient) {
    throw new APIError(HttpStatusCode.NOT_FOUND, 'Patient not found.');
  }

  const medicalRecords = await prisma.medical.findMany({
    where: { patientId: patient.id },
    include: { familyhistories: true },
  });

  const familyHistories = medicalRecords.flatMap(record => record.familyhistories);

  if (familyHistories.length === 0) {
    return res.json(new ApiResponse(HttpStatusCode.NOT_FOUND, [], 'No family history records found.'));
  }

  res.json(new ApiResponse(HttpStatusCode.OK, familyHistories, 'Family history records retrieved successfully'));
});

// Update Family History
export const updateFamilyHistory = asyncHandler(async (req, res) => {
  const { userId, hypertension, diabetesMellitus, anyUnnaturalDeath, otherSignificantHistory } = req.body;

  if (!userId) {
    throw new APIError(HttpStatusCode.BAD_REQUEST, 'User ID must be provided.');
  }

  const patient = await prisma.patient.findFirst({
    where: { userId },
    select: { id: true },
  });

  if (!patient) {
    throw new APIError(HttpStatusCode.NOT_FOUND, 'Patient not found');
  }

  const newFamilyHistory = await prisma.medical.create({
    data: {
      patientId: patient.id,
      familyhistories: {
        create: {
          hypertension,
          diabetesMellitus,
          anyUnnaturalDeath,
          otherSignificantHistory,
        },
      },
    },
    include: { familyhistories: true },
  });

  res.json(new ApiResponse(HttpStatusCode.OK, newFamilyHistory, 'Family history updated successfully'));
});

// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || HttpStatusCode.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal Server Error';
  res.status(status).json(new ApiResponse(status, null, message));
};

const generateAccessAndRefreshToken = async (user) => {
  try {
    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '8h',
    });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log('error: ', error);
    throw new APIError(500, 'Something went wrong while generating access and refresh token');
  }
};