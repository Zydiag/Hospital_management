import { apiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { hashPassword } from '../utils/hashPassword.js';
import { generateAccessAndRefreshToken } from '../utils/tokenGenerate.js';
import pkg from 'pg';
import 'dotenv/config';
import { configDotenv } from 'dotenv';
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

//create Doctor profile
export const createDoctorProfile = asyncHandler(async (req, res) => {
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
    specialization,
  } = req.body;

  // Check if all fields are filled
  if (!armyNo || !firstName || !dob || !password || !specialization) {
    throw new apiError(404, 'All fields are required to create a new user');
  }
  const parsedDob = new Date(dob);

  // Check if user already exists
  let existedDoctor = await prisma.user.findFirst({
    where: { armyNo },
  });

  if (existedDoctor) {
    // console.log("already exist ");
    // throw new error("Doctor already exists");
    throw new apiError(400, 'Doctor already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user and store in database

  // try {
  const newRequest = await prisma.request.create({
    data: {
      status: 'PENDING',
      doctor: {
        create: {
          user: {
            create: {
              armyNo,
              firstName,
              unit,
              rank,
              email,
              mobileNo,
              role: 'DOCTOR',
              dob: parsedDob,
              password: hashedPassword,
            },
          },
          specialization,
        },
      },
    },
  });
  // } catch (error) {
  //   throw new apiError(401, error?.message || 'Something went wrong while creating doctor request');
  // }

  if (!newRequest) {
    throw new apiError(401, 'Something went wrong while creating doctor');
  }

  let createdDoctor = await prisma.user.findFirst({
    where: { armyNo },
  });

  console.log('6th step ');
  return res
    .status(200)
    .json(
      new ApiResponse(200, createdDoctor, 'Doctor created successfully but it is not verified yet')
    );
});

// login doctor
export const loginDoctor = asyncHandler(async (req, res) => {
  const { armyNo, password } = req.body;
  console.log('req.body from doctor login', req.body);
  // check if all fields are filled
  if (!password || !armyNo) {
    throw new apiError(400, 'All fields are  required');
  }
  const doctor = await prisma.user.findFirst({
    where: {
      armyNo: armyNo,
    },
  });
  if (!doctor) {
    throw new apiError(404, 'User(doctor) not found');
  }
  // check if password is correct
  const isCorrect = await bcrypt.compare(password, doctor.password);
  if (!isCorrect) {
    throw new apiError(401, 'Incorrect password');
  }
  // check if user is a doctor
  if (doctor.role !== 'DOCTOR') {
    throw new apiError(401, 'User is not a doctor');
  }
  let userDoctor = await prisma.doctor.findFirst({
    where: {
      userId: doctor.id,
    },
  });
  // check status of doctor ( pending or approved )
  if (userDoctor.status !== 'APPROVED') {
    res.json(new ApiResponse(401, userDoctor, 'Doctor is not approved yet, so you cannot login'));
    throw new apiError(401, 'Doctor is not approved yet');
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
export const logoutDoctor = asyncHandler(async (req, res) => {
  await prisma.user.update({
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
    .json(new ApiResponse(200, {}, 'Doctor logout successfully'));
});

// Get Personal Info of patient by Army Number
export const getPersonalInfo = asyncHandler(async (req, res) => {
  console.log('Inside getPersonalInfo function');
  console.log('REFRESH_TOKEN_SECRET:', process.env.REFRESH_TOKEN_SECRET);

  const { armyNo } = req.body;
  // console.log(`req.user.id: ${req.user.id}`)
  // console.log(`armyNo: ${armyNo}`);
  if (!armyNo) {
    throw new apiError(401, 'Army number is required');
  }
  let user = await prisma.User.findFirst({
    where: {
      armyNo: armyNo,
      role: 'PATIENT',
    },
  });
  if (!user) {
    throw new apiError(501, 'Patient is not Regestered');
  }
  let info = {
    armyNo: user.armyNo,
    fullname: user.firstName,
    age: calculateAge(user.dob),
    unit: user.unit,
  };
  res.json(new ApiResponse(200, info, 'Personal Record:-'));
});

export const createPatientProfile = asyncHandler(async (req, res, next) => {
  console.log('creating patient profile', req.body);
  try {
    const { armyNo, unit, firstName, dob } = req.body;
    const parsedDob = new Date(dob);
    const existingUser = await prisma.user.findFirst({
      where: {
        armyNo: armyNo,
      },
    });
    console.log(existingUser);
    if (!existingUser) {
      console.log('step 2 ');
      await prisma.user.create({
        data: { armyNo: armyNo, unit: unit, firstName: firstName, dob: parsedDob, role: 'PATIENT' },
      });
    }
  } catch (error) {
    console.log('creating patient profile error', error);
    next(error);
  }
  res.json(new ApiResponse(200, {}, 'Patient profile created successfully'));
});

// Update Personal Info
export const updatePersonalInfo = asyncHandler(async (req, res, next) => {
  try {
    const { armyNo, unit, firstName, dob } = req.body;
    const parsedDob = new Date(dob);
    // Find the user by army number
    const existingUser = await prisma.user.findFirst({
      where: {
        armyNo: armyNo,
      },
    });
    console.log('step 1 ');
    if (!existingUser) {
      console.log('step 2 ');
      await prisma.user.create({
        data: { armyNo: armyNo, unit: unit, firstName: firstName, dob: parsedDob, role: 'PATIENT' },
      });
    }
    console.log('step 3 ');
    // Update the user data
    const updatedUser = await prisma.user.update({
      where: {
        armyNo: armyNo, // Use id as the unique identifier
      },
      data: {
        unit: unit,
        firstName: firstName,
        dob: parsedDob,
        // Assuming refreshToken is part of the User model
      },
    });

    // res.redirect('/personal-info');
  } catch (error) {
    next(error);
  }
  res.json(new ApiResponse(200, {}, 'Personal Info updated successfully'));
  // res.status(500).message('Personal Info updated successfully');
});

// Read Health Record
export const getHealthRecord = asyncHandler(async (req, res, next) => {
  try {
    const { armyNo, date } = req.body;

    // Find the user based on the army number
    const user = await prisma.User.findFirst({
      where: {
        armyNo: armyNo,
        role: 'PATIENT',
      },
    });

    if (!user) {
      throw new apiError(404, 'User not found');
    }

    // Find the patient based on the userId
    const patient = await prisma.Patient.findFirst({
      where: { userId: user.id },
    });
    if (!patient) {
      throw new apiError(404, 'Patient not found');
    }

    const medicalRecord = await prisma.Medical.findMany({
      where: {
        patientId: patient.id,
        createdAt: new Date(date),
      },
    });
    // Extract medical records from the patient
    //const medicalRecords = patient.Medical;

    res.json(new ApiResponse(200, medicalRecord, 'Health records retrieved successfully'));
  } catch (error) {
    next(error);
  }
});

// Update Health Record
export const updateHealthRecord = asyncHandler(async (req, res, next) => {
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
      date,
      armyNo,
    } = req.body;
    const doctr_ArmyNo = req.user.armyNo;
    const patient = await prisma.patient.findFirst({
      where: {
        user: {
          armyNo: armyNo,
          role: 'PATIENT',
        },
      },
      select: {
        id: true,
      },
    });
    if (!patient) {
      throw new apiError(404, 'error', 'Patient not found with the provided army number');
    }
    const patientId = patient.id;
    const doctor = await prisma.doctor.findFirst({
      where: {
        status: 'APPROVED',
        user: {
          armyNo: doctr_ArmyNo,
          role: 'DOCTOR',
        },
      },
    });
    if (!doctor) {
      throw new apiError(404, 'Doctor not found with the provided army number');
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
        patientId,
        doctorId: doctor.id,
        createdAt: new Date(date),
        updatedAt: new Date(date),
      },
    });
    res.json(new ApiResponse(202, newMedicalRecord, 'Medical record created successfully'));
  } catch (error) {
    throw new apiError(500, 'update medical error');
  }
});

// Read Personal Medical History
export const getTreatmentRecord = asyncHandler(async (req, res, next) => {
  const { armyNo, date } = req.body;
  try {
    const user = await prisma.User.findFirst({
      where: {
        armyNo: armyNo,
        role: 'PATIENT',
      },
    });
    const patient = await prisma.Patient.findFirst({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
      },
    });
    if (!patient) {
      throw new apiError(404, 'Patient not found');
    }
    const patientId = patient.id;
    const treatmentRecords = await prisma.treatment.findMany({
      where: {
        patientId,
        createdAt: new Date(date),
      },
      select: {
        diagnosis: true,
        description: true,
      },
    });
    const parseddescription = JSON.parse(treatmentRecords.description);
    const info = {
      diagnosis: treatmentRecords.diagnosis,
      note: parseddescription.note,
      medicationName: parseddescription.medicationName,
      knownAllergies: parseddescription.knownAllergies,
      miscellaneous: parseddescription.miscellaneous,
    };
    res.json(new ApiResponse(200, { info }, 'Treatment records retrieved successfully'));
  } catch (error) {
    next(error);
  }
});

// Update Treatment Records
export const updateTreatmentRecord = asyncHandler(async (req, res, next) => {
  try {
    const { diagnosis, note, medicationName, date, knownAllergies, miscellaneous, armyNo } =
      req.body;

    console.log('update treatment record', req.body);
    const doctr_ArmyNo = req.user.armyNo;
    const patient = await prisma.Patient.findFirst({
      where: {
        user: {
          armyNo: armyNo,
          role: 'PATIENT',
        },
      },
      select: {
        id: true, // Select only the id field
      },
    });

    const doctor = await prisma.Doctor.findFirst({
      where: {
        status: 'APPROVED',
        user: {
          armyNo: doctr_ArmyNo,
          role: 'DOCTOR',
        },
      },
    });

    if (!doctor) {
      throw new apiError(404, 'Doctor not found');
    }

    if (!patient) {
      throw new apiError(404, 'Patient not found');
    }
    const patientId = patient.id;

    const description = JSON.stringify({
      note: note,
      medicationName: medicationName,
      knownAllergies: knownAllergies,
      miscellaneous: miscellaneous,
    });

    console.log('description', description);

    const newTreatment = await prisma.treatment.create({
      data: {
        diagnosis: diagnosis,
        description: description,
        createdAt: new Date(date),
        updatedAt: new Date(date),
        patientId: patientId,
        doctorId: doctor.id,
      },
    });

    // Accessing related data directly from newMedicalRecord
    res.json(new ApiResponse(200, newTreatment, 'Treatment record created successfully'));
  } catch (error) {
    console.log(error);
    throw new apiError(500, 'update treatment error', error.message);
  }
});

// Read Family History
export const getFamilyHistory = asyncHandler(async (req, res, next) => {
  const { armyNo } = req.body;
  try {
    // Ensure the ID is provided
    const user = await prisma.User.findFirst({
      where: {
        armyNo: armyNo,
        role: 'PATIENT',
      },
    });
    const userId = user.id;
    if (!user) {
      throw new apiError(404, 'User not found');
    }

    const patient = await prisma.Patient.findFirst({
      where: {
        userId: userId,
      },
      select: {
        id: true, // Select only the id field
      },
    });

    // Check if patient information exists
    if (!patient) {
      throw new apiError(404, 'patient not found');
    }

    const patientId = patient.id;
    const familyhistories = await prisma.familyHistory.findMany({
      where: {
        patientId,
      },
    });

    res.json(
      new ApiResponse(200, familyHistories, 'Family history records retrieved successfully')
    );
  } catch (error) {
    console.error('Failed to retrieve family history:', error);
    res.status(500).json({ error: 'Internal server error.' });
    next(error);
  }
});

// Update Family History
export const updateFamilyHistory = asyncHandler(async (req, res, next) => {
  const doctor_ArmyNo = req.user.armyNo;
  const {
    hypertension,
    diabetesMellitus,
    anyUnnaturalDeath,
    otherSignificantHistory,
    date,
    armyNo,
  } = req.body;

  // console.log(`date:${date}, armyNo:${armyNo}`);
  // console.log(`doctor_Armyno:${doctor_Armyno}`);

  try {
    console.log('updatefamilyhistoryroute');
    const user = await prisma.User.findFirst({
      where: {
        armyNo: armyNo,
        role: 'PATIENT',
      },
    });
    const patient = await prisma.Patient.findFirst({
      where: {
        userId: user.id,
      },
    });

    const doctor = await prisma.Doctor.findFirst({
      where: {
        status: 'APPROVED',
        user: {
          armyNo: doctor_ArmyNo,
          role: 'DOCTOR',
        },
      },
      select: {
        id: true, // Select only the id field
      },
    });
    if (!doctor) {
      throw new apiError(404, 'Doctor not found');
    }

    if (!patient) {
      throw new apiError(404, 'Patient not found');
    }
    const patientId = patient.id;
    const existfamily = await prisma.familyHistory.findFirst({
      where: {
        patientId: patientId,
        doctorId: doctor.id,
      },
    });
    if (existfamily) {
      const exfamily = await prisma.familyHistory.update({
        where: {
          patientId: patientId,
          doctorId: doctor.id,
        },
        data: {
          hypertension,
          diabetesMellitus,
          anyUnnaturalDeath,
          otherSignificantHistory,
          createdAt: new Date(date),
        },
      });
      res.json(new ApiResponse(200, exfamily, 'Family history updated successfully'));
    }
    const family = await prisma.familyHistory.create({
      data: {
        hypertension: hypertension,
        diabetesMellitus: diabetesMellitus,
        anyUnnaturalDeath: anyUnnaturalDeath,
        otherSignificantHistory: otherSignificantHistory,
        patientId: patientId,
        doctorId: doctor.id,
        createdAt: new Date(date),
      },
    });

    res.json(new ApiResponse(200, family, 'Family history created successfully'));
  } catch (error) {
    next(error);
  }
});

export const getAmeReports = asyncHandler(async (req, res) => {
  const { armyNo, date } = req.body;

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
  const parseddescription = JSON.parse(ameReports.description);
  const info = {
    bloodHb: parseddescription.bloodHb,
    TLC: parseddescription.TLC,
    DLC: parseddescription.DLC,
    urineRE: parseddescription.urineRE,
    urineSpGravity: parseddescription.urineSpGravity,
  };
  // Return all the test reports
  res.json(new ApiResponse(200, info, 'Ame test reports retrieved successfully'));
});

export const getAme1Reports = asyncHandler(async (req, res) => {
  const { armyNo, date } = req.body;

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
  const parseddescription = JSON.parse(ameReports.description);
  const info = {
    bloodHb: parseddescription.bloodHb,
    TLC: parseddescription.TLC,
    DLC: parseddescription.DLC,
    urineRE: parseddescription.urineRE,
    urineSpGravity: parseddescription.urineSpGravity,
    bloodSugarFasting: parseddescription.bloodSugarFasting,
    bloodSugarPP: parseddescription.bloodSugarPP,
    restingECG: parseddescription.restingECG,
  };
  // Return all the test reports
  res.json(new ApiResponse(200, info, 'Ame1 test reports retrieved successfully'));
});
export const getPmeReports = asyncHandler(async (req, res) => {
  const { armyNo, date } = req.body;

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
  const parseddescription = JSON.parse(ameReports.description);
  const info = {
    bloodHb: parseddescription.bloodHb,
    TLC: parseddescription.TLC,
    DLC: parseddescription.DLC,
    urineRE: parseddescription.urineRE,
    urineSpGravity: parseddescription.urineSpGravity,
    bloodSugarFasting: parseddescription.bloodSugarFasting,
    bloodSugarPP: parseddescription.bloodSugarPP,
    restingECG: parseddescription.restingECG,
    uricAcid: parseddescription.uricAcid,
    urea: parseddescription.urea,
    creatinine: parseddescription.creatinine,
    cholesterol: parseddescription.cholesterol,
    lipidProfile: parseddescription.lipidProfile,
    xrayChestPA: parseddescription.xrayChestPA,
  };
  // Return all the test reports
  res.json(new ApiResponse(200, info, 'Pme test reports retrieved successfully'));
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
  if (
    (age >= 25 && age <= 26) ||
    (age >= 30 && age <= 31) ||
    (age >= 37 && age <= 38) ||
    (age >= 42 && age <= 43) ||
    (age >= 47 && age <= 48) ||
    (age >= 49 && age <= 50) ||
    (age > 51 && age <= 53) ||
    (age > 54 && age <= 57) ||
    (age > 58 && age <= 59)
  ) {
    return 'AME2';
  } else if (
    (age >= 35 && age <= 36) ||
    (age >= 40 && age <= 41) ||
    (age >= 45 && age <= 46) ||
    (age > 50 && age <= 51) ||
    (age > 53 && age <= 54) ||
    (age > 57 && age <= 58)
  ) {
    return 'PME';
  } else {
    return 'AME1';
  }
};

//Function to update AME1
export const updateAME1 = asyncHandler(async (req, res) => {
  // Extract required parameters from request body

  const { armyNo, date, bloodHb, TLC, DLC, urineRE, urineSpGravity } = req.body;
  const doctr_ArmyNo = req.user.armyNo;

  const user = await prisma.User.findFirst({
    where: {
      armyNo: armyNo,
    },
  });

  const patient = await prisma.Patient.findFirst({
    where: {
      userId: user.id,
    },
  });

  if (!patient) {
    throw new apiError(404, 'Patient not found');
  }
  const doctor = await prisma.Doctor.findFirst({
    where: {
      status: 'APPROVED',
      user: {
        armyNo: doctr_ArmyNo,
        role: 'DOCTOR',
      },
    },
    select: {
      id: true, // Select only the id field
    },
  });

  // Find the existing AME1 record by ID
  const ame1 = await prisma.AME.findFirst({
    where: { patientId: patient.id },
  });

  // If AME1 record not found, throw an error
  if (!ame1) {
    throw new apiError(404, 'AME1 record not found');
  }
  const description = JSON.stringify({
    bloodHb,
    TLC,
    DLC,
    urineRE,
    urineSpGravity,
  });
  // Update the AME1 record with new data
  const updatedAME1 = await prisma.AME.create({
    data: {
      date: new Date(date),
      createdAt: new Date(date),
      patientId: patient.id,
      description,
      doctorId: doctor.id,
    },
  });

  // Send response with updated AME1 record
  res.json(new ApiResponse(200, updatedAME1, 'AME1 test report updated successfully'));
});

//Function to update AME2
export const updateAME2 = asyncHandler(async (req, res) => {
  // Extract required parameters from request body
  console.log('AME2');
  const {
    armyNo,
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
  const doctr_ArmyNo = req.user.armyNo;
  const user = await prisma.User.findFirst({
    where: {
      armyNo: armyNo,
    },
  });
  const patient = await prisma.Patient.findFirst({
    where: {
      userId: user.id,
    },
  });
  if (!patient) {
    throw new apiError(404, 'Patient not found');
  }
  const doctor = await prisma.Doctor.findFirst({
    where: {
      status: 'APPROVED',
      user: {
        armyNo: doctr_ArmyNo,
        role: 'DOCTOR',
      },
    },
    select: {
      id: true, // Select only the id field
    },
  });
  // Find the existing AME2 record by ID
  const ame2 = await prisma.AME2.findFirst({
    where: { patientId: patient.id, doctorId: doctor.id },
  });

  // If AME2 record not found, throw an error
  if (!ame2) {
    throw new apiError(404, 'AME2 record not found');
  }
  const description = JSON.stringify({
    bloodHb,
    TLC,
    DLC,
    urineRE,
    urineSpGravity,
    bloodSugarFasting,
    bloodSugarPP,
    restingECG,
  });
  // Update the AME2 record with new data
  const updatedAME2 = await prisma.AME2.create({
    data: {
      date: new Date(date),
      createdAt: new Date(date),
      patientId: patient.id,
      doctorId: doctor.id,
      description,
    },
  });

  // Send response with updated AME2 record
  res.json(new ApiResponse(200, updatedAME2, 'AME2 test report updated successfully'));
});
//Function to update PME
export const updatePME = asyncHandler(async (req, res) => {
  // Extract required parameters from request body
  const {
    armyNo,
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
  const doctr_ArmyNo = req.user.armyNo;
  const user = await prisma.User.findFirst({
    where: {
      armyNo: armyNo,
    },
  });
  const patient = await prisma.Patient.findFirst({
    where: {
      userId: user.id,
    },
  });
  if (!patient) {
    throw new apiError(404, 'patient not found');
  }
  const doctor = await prisma.Doctor.findFirst({
    where: {
      status: 'APPROVED',
      user: {
        armyNo: doctr_ArmyNo,
        role: 'DOCTOR',
      },
    },
    select: {
      id: true, // Select only the id field
    },
  });
  // Find the existing PME record by ID
  const pme = await prisma.PME.findUnique({
    where: { patientId: patient.id },
  });

  // If PME record not found, throw an error
  if (!pme) {
    throw new apiError(404, 'PME record not found');
  }
  const description = JSON.stringify({
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
  });
  // Update the PME record with new data
  const updatedPME = await prisma.pME.create({
    data: {
      date: new Date(date),
      createdAt: new Date(date),
      patientId: patient.id,
      doctorId: doctor.id,
      description,
    },
  });

  // Send response with updated PME record
  res.json(new ApiResponse(200, updatedPME, 'PME test report updated successfully'));
});

// Route to add a test report
export const addTestReport = asyncHandler(async (req, res) => {
  console.log('you are inside testreport route');
  const { armyNo } = req.body;

  // Fetch user's date of birth using army number
  const user = await prisma.User.findFirst({
    where: { armyNo, role: 'PATIENT' },
    select: { dob: true },
  });
  console.log(user);
  if (!user || !user.dob) {
    throw new apiError(404, 'User not found or date of birth not available');
  }

  // Calculate age based on date of birth
  const age = calculateAge(user.dob);
  console.log(age);
  // Determine the test to be performed based on age
  const testType = getTestType(age);
  console.log(testType);
  // Call the respective update test function based on test type
  let updatedTest;
  switch (testType) {
    case 'AME1':
      updatedTest = await updateAME1(req, res);
      break;
    case 'AME2':
      updatedTest = await updateAME2(req, res);
      break;
    case 'PME':
      updatedTest = await updatePME(req, res);
      break;
    default:
      throw new apiError(404, 'Invalid test type');
  }
  res.json(new ApiResponse(200, updatedTest, 'Test report added successfully'));
});

// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
};
