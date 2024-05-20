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

//create Doctor profile
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

  // check if all fields are filled
  if (!armyNo || !unit || !rank || !firstName || !lastName || !dob || !password)
    throw new apiError(400, 'All fields are required to create a new user');
  // check if user already exists
  let existedDoctor = await prisma.user.findFirst({
    where: {
      armyNo: armyNo,
    },
  });
  if (existedDoctor) {
    throw new apiError(400, 'Doctor already exists');
  }
  // hash password
  const hashedPassword = await hashPassword(password);
  // create user and store in database
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
    throw new apiError(505, 'Something went wrong while registering user');
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
  // return response
  return res
    .status(200)
    .json(
      new apiResponse(200, createdDoctor, 'Doctor created successfully but it is not verified yet')
    );
});

// Get Personal Info of patient by Army Number
export const getPersonalInfo = async (req, res) => {
  console.log('Inside getPersonalInfo function');
  const { unit, rank, firstName, middleName, lastName, email, mobileNo, dob } = req.body;
  const armyNo = req.body.armyNo;
  console.log(armyNo);

  if (!armyNo) {
    console.log(req.body);
    return res.status(400).json({
      error: 'Army number is required',
    });
  }

  let user = await prisma.user.findFirst({
    where: {
      armyNo: armyNo,
    },
  });

  if (!user) {
    // Validation for all required fields
    if (!unit || !rank || !firstName || !lastName || !dob) {
      console.log('abs');
      return res.status(400).json({ error: 'All fields are required to create a new user' });
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

    const userId = user.id; // Assuming you need the user ID for creating a patient entry
    // Create a patient entry for the user
    patient = await prisma.patient.create({
      data: {
        userId: userId,
      },
    });
  } else if (!user.refreshToken) {
    // If user exists but does not have a refresh token, generate a new refresh token and update the user
    const refreshToken = generateRefreshToken(user);
    user = await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });
  }

  // Set the refresh token as an HTTP-only cookie
  res.cookie('refreshToken', user.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Ensure the cookie is only sent over HTTPS in production
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json(user);
};

// Update Personal Info
export const updatePersonalInfo = async (req, res, next) => {
  try {
    const { middleName, lastName, email, mobileNo } = req.body;

    // Find the user by army number
    const existingUser = await prisma.user.findFirst({
      where: {
        armyNo: armyNo,
      },
    });

    if (!existingUser) {
      throw new APIError('Not Found', HttpStatusCode.NOT_FOUND, 'User Not Found');
    }

    // Update the user data
    const updatedUser = await prisma.user.update({
      where: {
        id: existingUser.id, // Use id as the unique identifier
      },
      data: {
        unit,
        rank,
        dateOfCommission,
        firstName,
        middleName,
        lastName,
        email,
        mobileNo,
        dob,
        refreshToken, // Assuming refreshToken is part of the User model
      },
    });

    res.redirect('/personal-info');
  } catch (error) {
    next(error);
  }
};

// Read Health Record
export const getHealthRecord = async (req, res, next) => {
  try {
    const { armyNo } = req.body;

    // Find the user based on the army number
    const user = await prisma.User.findFirst({
      where: { armyNo: armyNo },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the patient based on the userId
    const patient = await prisma.patient.findFirst({
      where: { userId: user.id },
    });

    const medicalRecord = await prisma.medical.findMany({
      where: { patientId: patient.id },
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Extract medical records from the patient
    //const medicalRecords = patient.Medical;

    res.json({ medicalRecord });
  } catch (error) {
    next(error);
  }
};

// Update Health Record
export const updateHealthRecord = async (req, res, next) => {
  try {
    const {
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
    const armyNo = req.body.armyNo; // Assuming armyNo is available in the request

    // Find the patient by army number
    const patient = await prisma.patient.findFirst({
      where: {
        user: {
          armyNo: armyNo,
        },
      },
      select: {
        id: true, // Select only the id field
      },
    });

    // If patient is not found, handle the error
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found with the provided army number' });
    }

    const patientId = patient.id;

    // Create a new medical record
    const newMedicalRecord = await prisma.Medical.create({
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
        patientId,
      },
    });

    // Send a JSON response in Postman
    res.json({ message: 'Medical record created successfully', medicalRecord: newMedicalRecord });
  } catch (error) {
    next(error);
  }
};

// Read Personal Medical History
export const getTreatmentRecord = async (req, res, next) => {
  try {
    const patient = await prisma.patient.findFirst({
      where: {
        userId: userId,
      },
      select: {
        id: true, // Select only the id field
      },
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const patientId = patient.id;

    // Fetch treatment records associated with the patient

    const treatmentRecords = await prisma.Treatment.findMany({
      where: {
        patientId,
      },
      include: {
        Medication: true,
      },
    });

    if (treatmentRecords) {
      const description = JSON.parse(treatmentRecords.description);
    }

    res.json({
      presentingComplaints: description.presentingComplaints,
      diagnosis: description.diagnosis,
      treatmentGiven: description.treatmentGiven,
      miscellaneous: description.miscellaneous,
      medicationRecords,
    });
  } catch (error) {
    next(error);
  }
};

// Update Treatment Records
export const updateTreatmentRecord = async (req, res, next) => {
  try {
    const {
      armyNo,
      presentingComplaints,
      diagnosis,
      treatmentGiven,
      miscellaneous,
      medication,
      medicationDes,
    } = req.body;

    // Find the patient by army number
    const patient = await prisma.patient.findFirst({
      where: {
        user: {
          armyNo: armyNo,
        },
      },
      select: {
        id: true, // Select only the id field
      },
    });

    const patientId = patient.id;

    const description = JSON.stringify({
      presentingComplaints: presentingComplaints,
      diagnosis: diagnosis,
      treatmentGiven: treatmentGiven,
      miscellaneous: miscellaneous,
    });

    const newTreatment = await prisma.Treatment.create({
      data: {
        description: description,
        //doctorId: doctorId,
        patientId,
      },
    });

    // Accessing related data directly from newMedicalRecord
    res.json({
      newTreatment,
    });
  } catch (error) {
    next(error);
  }
};

// Read Family History
export const getFamilyHistory = async (req, res, next) => {
  try {
    // Ensure the ID is provided
    const userId = req.body.id;
    if (!userId) {
      return res.status(400).json({ error: 'User ID must be provided.' });
    }

    const patient = await prisma.patient.findFirst({
      where: {
        userId: userId,
      },
      select: {
        id: true, // Select only the id field
      },
    });

    // Check if patient information exists
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found.' });
    }

    const patientId = patient.id;
    const medical = await prisma.Medical.findMany({
      where: {
        patientId,
      },
      include: {
        familyhistories: true,
      },
    });

    // Flatten family histories from medical records
    const familyhistories = Medical.flatMap((record) => record.familyhistories);

    // Check if family histories are found
    if (familyhistories.length === 0) {
      return res.status(404).json({ message: 'No family history records found.' });
    }

    res.json({ familyhistories });
  } catch (error) {
    console.error('Failed to retrieve family history:', error);
    res.status(500).json({ error: 'Internal server error.' });
    next(error);
  }
};

// Update Family History
export const updateFamilyHistory = async (req, res, next) => {
  try {
    console.log('updatefamilyhistoryroute');
    const { hypertension, diabetesMellitus, anyUnnaturalDeath, otherSignificantHistory } = req.body;
    const patient = await prisma.patient.findFirst({
      where: {
        userId: userId,
      },
      select: {
        id: true, // Select only the id field
      },
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    const patientId = patient.id;

    const newMedicalRecord = await prisma.Medical.create({
      data: {
        patientId: patientId,
        familyhistories: {
          create: {
            hypertension,
            diabetesMellitus,
            anyUnnaturalDeath,
            otherSignificantHistory,
          },
        },
      },
      include: {
        familyhistories: true,
      },
    });

    res.status(200).json({ message: 'Family history updated', data: newMedicalRecord });
  } catch (error) {
    next(error);
  }
};

// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
};