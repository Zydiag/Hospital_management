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

  const newDoctorRequest = await prisma.Request.create({
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
      new apiResponse(200, createdDoctor, 'Doctor created successfully but it is not verified yet')
    );
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

export const getAllTestReports = asyncHandler(async (req, res) => {
  const { armyNo } = req.body;

  // Find the user by army number
  const user = await prisma.user.findFirst({
    where: { armyNo },
    select: { id: true },
  });

  // If user not found, throw an error
  if (!user) {
    throw new APIError(HttpStatusCode.NOT_FOUND, 'User not found');
  }

  // Find all AME, AME2, and PME test reports associated with the user
  const ameReports = await prisma.aME.findMany({
    where: { medical: { patientId: user.id } },
    include: { medical: true },
  });

  const ame2Reports = await prisma.aME2.findMany({
    where: { medical: { patientId: user.id } },
    include: { medical: true },
  });

  const pmeReports = await prisma.pME.findMany({
    where: { medical: { patientId: user.id } },
    include: { medical: true },
  });

  // Combine all reports into a single array
  const allReports = [...ameReports, ...ame2Reports, ...pmeReports];

  // If no reports found, return an empty array
  if (!allReports || allReports.length === 0) {
    return res.json(new ApiResponse(HttpStatusCode.NOT_FOUND, [], 'No test reports found'));
  }

  // Return all the test reports
  res.json(new ApiResponse(HttpStatusCode.OK, allReports, 'All test reports retrieved successfully'));
});

// Function to calculate age based on date of birth
export const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  // Calculate the fraction of the current year that has elapsed
  const fractionOfYear = (monthDiff * 30 + dayDiff) / 365;

  // Calculate age as a float value
  age += fractionOfYear;

  return age;
};


// Function to determine the test type based on age
export const getTestType = (age) => {
  if ((age >= 25 && age <= 26) || (age >= 30 && age <= 31) || (age >= 37 && age <= 38) ||
      (age >= 42 && age <= 43) || (age >= 47 && age <= 48) || (age >= 49 && age <= 50) ||
      (age >= 51 && age <= 53) || (age >= 54 && age <= 57) || (age >= 58 && age <= 59)) {
    return 'AME2';
  } else if ((age >= 35 && age <= 36) || (age >= 40 && age <= 41) || (age >= 45 && age <= 46) ||
             (age >= 50 && age <= 51) || (age >= 53 && age <= 54) || (age >= 57 && age <= 58)) {
    return 'PME';
  } else {
    return 'AME1';
  }
};

//Function to update AME1
export const updateAME1 = asyncHandler(async (req, res) => {
  // Extract required parameters from request body
  const { id, date, bloodHb, TLC, DLC, urineRE, urineSpGravity } = req.body;

  // Find the existing AME1 record by ID
  const ame1 = await prisma.aME.findUnique({
    where: { id },
  });

  // If AME1 record not found, throw an error
  if (!ame1) {
    throw new APIError(HttpStatusCode.NOT_FOUND, 'AME1 record not found');
  }

  // Update the AME1 record with new data
  const updatedAME1 = await prisma.aME.update({
    where: { id },
    data: {
      date: new Date(date),
      bloodHb,
      TLC,
      DLC,
      urineRE,
      urineSpGravity,
    },
  });

  // Send response with updated AME1 record
  res.json(new ApiResponse(HttpStatusCode.OK, updatedAME1, 'AME1 test report updated successfully'));
});

//Function to update AME2
export const updateAME2 = asyncHandler(async (req, res) => {
  // Extract required parameters from request body
  const {
    id,
    date,
    bloodHb,
    TLC,
    DLC,
    urineRE,
    urineSpGravity,
    bloodSugarFasting,
    bloodSugarPP,
    restingECG,
  } = req.body;

  // Find the existing AME2 record by ID
  const ame2 = await prisma.aME2.findUnique({
    where: { id },
  });

  // If AME2 record not found, throw an error
  if (!ame2) {
    throw new APIError(HttpStatusCode.NOT_FOUND, 'AME2 record not found');
  }

  // Update the AME2 record with new data
  const updatedAME2 = await prisma.aME2.update({
    where: { id },
    data: {
      date: new Date(date),
      bloodHb,
      TLC,
      DLC,
      urineRE,
      urineSpGravity,
      bloodSugarFasting,
      bloodSugarPP,
      restingECG,
    },
  });

  // Send response with updated AME2 record
  res.json(new ApiResponse(HttpStatusCode.OK, updatedAME2, 'AME2 test report updated successfully'));
});

//Function to update PME
export const updatePME = asyncHandler(async (req, res) => {
  // Extract required parameters from request body
  const {
    id,
    date,
    bloodHb,
    TLC,
    DLC,
    urineRE,
    urineSpGravity,
    bloodSugarFasting,
    bloodSugarPP,
    restingECG,
    uricAcid,
    urea,
    creatinine,
    cholesterol,
    lipidProfile,
    xrayChestPA,
  } = req.body;

  // Find the existing PME record by ID
  const pme = await prisma.pME.findUnique({
    where: { id },
  });

  // If PME record not found, throw an error
  if (!pme) {
    throw new APIError(HttpStatusCode.NOT_FOUND, 'PME record not found');
  }

  // Update the PME record with new data
  const updatedPME = await prisma.pME.update({
    where: { id },
    data: {
      date: new Date(date),
      bloodHb,
      TLC,
      DLC,
      urineRE,
      urineSpGravity,
      bloodSugarFasting,
      bloodSugarPP,
      restingECG,
      uricAcid,
      urea,
      creatinine,
      cholesterol,
      lipidProfile,
      xrayChestPA,
    },
  });

  // Send response with updated PME record
  res.json(new ApiResponse(HttpStatusCode.OK, updatedPME, 'PME test report updated successfully'));
});

// Route to add a test report
export const addTestReport = asyncHandler(async (req, res) => {
  const { armyNo } = req.body;

  // Fetch user's date of birth using army number
  const user = await prisma.user.findFirst({
    where: { armyNo },
    select: { dob: true },
  });

  if (!user || !user.dob) {
    throw new APIError(HttpStatusCode.NOT_FOUND, 'User not found or date of birth not available');
  }

  // Calculate age based on date of birth
  const age = calculateAge(user.dob);

  // Determine the test to be performed based on age
  const testType = getTestType(age);

  // Call the respective update test function based on test type
  let updatedTest;
  switch (testType) {
    case 'AME1':
      updatedTest = await updateAME1Test(armyNo);
      break;
    case 'AME2':
      updatedTest = await updateAME2Test(armyNo);
      break;
    case 'PME':
      updatedTest = await updatePMETest(armyNo);
      break;
    default:
      throw new APIError(HttpStatusCode.BAD_REQUEST, 'Invalid test type');
  }

  res.json(new ApiResponse(HttpStatusCode.OK, updatedTest, 'Test report added successfully'));
});

// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || HttpStatusCode.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal Server Error';
  res.status(status).json(new ApiResponse(status, null, message));
};
