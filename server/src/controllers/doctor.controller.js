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

  let doctor_user = await prisma.user.findFirst({
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
    res.json(new ApiResponse(401, user, 'Doctor is not approved yet, so you cannot login'));
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
<<<<<<< HEAD
  // console.log(`req.user.id: ${req.user.id}`)
  // console.log(`armyNo: ${armyNo}`);
=======

  console.log(armyNo);
>>>>>>> c24a89bb5207567a1503d06122631f317bc822f8

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

<<<<<<< HEAD
  res.json(new ApiResponse(200, info, 'Personal Record:-'));
=======
  res.json(new ApiResponse(HttpStatusCode.OK, info, 'Personal Record:-'));
>>>>>>> c24a89bb5207567a1503d06122631f317bc822f8
});

// Update Personal Info
export const updatePersonalInfo = asyncHandler(async (req, res, next) => {
  try {
    const { armyNo, unit, firstName, dob } = req.body;
    const parsedDob = new Date(dob);
    // Find the user by army number
    const existingUser = await prisma.User.findFirst({
      where: {
        armyNo: armyNo,
      },
    });
    console.log('step 1 ')
    if (!existingUser) {
      console.log('step 2 ')
      await prisma.User.create({
<<<<<<< HEAD
        data: {armyNo: armyNo,
        unit: unit,
        firstName: firstName,
        dob: parsedDob,
        role: 'PATIENT',}
=======
        armyNo: armyNo,
        unit: unit,
        firstName: firstName,
        dob: dob,
        role: 'PATIENT',
>>>>>>> c24a89bb5207567a1503d06122631f317bc822f8
      });
    }
    console.log('step 3 ')
    // Update the user data
    const updatedUser = await prisma.User.update({
      where: {
        armyNo: armyNo, // Use id as the unique identifier
      },
      data: {
        unit: unit,
        firstName: firstName,
<<<<<<< HEAD
        dob: parsedDob,
=======
        dob: dob,
>>>>>>> c24a89bb5207567a1503d06122631f317bc822f8
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

<<<<<<< HEAD
    res.json(new ApiResponse(200, medicalRecord, 'Health records retrieved successfully'));
=======
    res.json(
      new ApiResponse(HttpStatusCode.OK, medicalRecord, 'Health records retrieved successfully')
    );
>>>>>>> c24a89bb5207567a1503d06122631f317bc822f8
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
<<<<<<< HEAD
    } = req.body;
    const doctr_ArmyNo=req.user.armyNo;
=======
      armyNo1,
    } = req.body;
>>>>>>> c24a89bb5207567a1503d06122631f317bc822f8
    //const armyNo = req.body.armyNo; // Assuming armyNo is available in the request
    // Find the patient by army number
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
<<<<<<< HEAD

    const doctor=await prisma.Doctor.findFirst({
      where:{
        status:"APPROVED",
        user:{
          armyNo:doctr_ArmyNo,
          role:"DOCTOR",
        }
      }
    })
    if(!doctor){
      throw new apiError(404, 'Doctor not found with the provided army number');
=======
    const doctor = await prisma.Doctor.findFirst({
      where: {
        status: 'APPROVED',
        user: {
          armyNo: armyNo1,
          role: 'DOCTOR',
        },
      },
    });
    if (!doctor) {
      throw new apiError(
        HttpStatusCode.NOT_FOUND,
        'Doctor not found with the provided army number'
      );
>>>>>>> c24a89bb5207567a1503d06122631f317bc822f8
    }

    // If patient is not found, handle the error
    if (!patient) {
<<<<<<< HEAD
      throw new apiError(404, 'Patient not found with the provided army number');
=======
      throw new apiError(
        HttpStatusCode.NOT_FOUND,
        'Patient not found with the provided army number'
      );
>>>>>>> c24a89bb5207567a1503d06122631f317bc822f8
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
        patientId,
        doctorId: doctor.id,
        createdAt: new Date(date),
        updatedAt: new Date(date),
      },
    });

    // Send a JSON response in Postman
<<<<<<< HEAD
    res.json(new ApiResponse(202, newMedicalRecord, 'Medical record created successfully'));
=======
    res.json(
      new ApiResponse(HttpStatusCode.OK, newMedicalRecord, 'Medical record created successfully')
    );
>>>>>>> c24a89bb5207567a1503d06122631f317bc822f8
  } catch (error) {
    next(error);
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
        id: true, // Select only the id field
      },
    });

    if (!patient) {
      throw new apiError(404, 'Patient not found');
    }

    const patientId = patient.id;

    // Fetch treatment records associated with the patient

    const treatmentRecords = await prisma.treatment.findMany({
      where: {
        patientId,
        createdAt: new Date(date),
      },
      include: {
        diagnosis: true,
        note: true,
        medicationName: true,
        miscellaneous: true,
        knownAllergies: true,
      },
    });

    res.json(
      new ApiResponse(
<<<<<<< HEAD
        200,
=======
        HttpStatusCode.OK,
>>>>>>> c24a89bb5207567a1503d06122631f317bc822f8
        { treatmentRecords, descriptions },
        'Treatment records retrieved successfully'
      )
    );
  } catch (error) {
    next(error);
  }
});

// Update Treatment Records
export const updateTreatmentRecord = asyncHandler(async (req, res, next) => {
  try {
<<<<<<< HEAD
    const { diagnosis, note, medicationName, date, knownAllergies, miscellaneous, armyNo } =
      req.body;
      const doctr_ArmyNo=req.user.armyNo;
=======
    const {
      diagnosis,
      note,
      medicationName,
      date,
      knownAllergies,
      miscellaneous,
      armyNo,
      armyNo1,
    } = req.body;

>>>>>>> c24a89bb5207567a1503d06122631f317bc822f8
    // Find the patient by army number

    // console.log(`date:${date}, armyNo:${armyNo}`);
    // console.log(`doctorUserId:${doctorUserId}`);

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
<<<<<<< HEAD

    const doctor=await prisma.Doctor.findFirst({
      where:{
        status:"APPROVED",
        user:{
          armyNo:doctr_ArmyNo,
          role:"DOCTOR",
        }
      }
    })

    if (!doctor) {
      throw new apiError(404, 'Doctor not found');
    }

    if (!patient) {
      throw new apiError(404, 'Patient not found');
=======
    const doctor = await prisma.Doctor.findFirst({
      where: {
        status: 'APPROVED',
        user: {
          armyNo: armyNo1,
          role: 'DOCTOR',
        },
      },
    });
    if (!doctor) {
      throw new apiError(HttpStatusCode.NOT_FOUND, 'Doctor not found');
    }
    if (!patient) {
      throw new apiError(HttpStatusCode.NOT_FOUND, 'Patient not found');
>>>>>>> c24a89bb5207567a1503d06122631f317bc822f8
    }
    const patientId = patient.id;

    // const description = JSON.stringify({
    //  presentingComplaints: presentingComplaints,
    //  diagnosis: diagnosis,
    //   treatmentGiven: treatmentGiven,
    //  miscellaneous: miscellaneous
    //});

    const newTreatment = await prisma.treatment.create({
      data: {
        diagnosis: diagnosis,
        note: note,
        medicationName: medicationName,
        knownAllergies: knownAllergies,
        miscellaneous: miscellaneous,
        createdAt: new Date(date),
        updatedAt: new Date(date),
        patientId: patientId,
        doctorId: doctor.id,
      },
    });

    // Accessing related data directly from newMedicalRecord
<<<<<<< HEAD
    res.json(new ApiResponse(200, newTreatment, 'Treatment record created successfully'));
=======
    res.json(
      new ApiResponse(HttpStatusCode.OK, newTreatment, 'Treatment record created successfully')
    );
>>>>>>> c24a89bb5207567a1503d06122631f317bc822f8
  } catch (error) {
    next(error);
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
<<<<<<< HEAD
      throw new apiError(404, 'User not found');
=======
      throw new apiError(HttpStatusCode.BAD_REQUEST, 'User not found');
>>>>>>> c24a89bb5207567a1503d06122631f317bc822f8
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
<<<<<<< HEAD
      new ApiResponse(200, familyHistories, 'Family history records retrieved successfully')
=======
      new ApiResponse(
        HttpStatusCode.OK,
        familyHistories,
        'Family history records retrieved successfully'
      )
>>>>>>> c24a89bb5207567a1503d06122631f317bc822f8
    );
  } catch (error) {
    console.error('Failed to retrieve family history:', error);
    res.status(500).json({ error: 'Internal server error.' });
    next(error);
  }
});

// Update Family History
export const updateFamilyHistory = asyncHandler(async (req, res, next) => {
<<<<<<< HEAD
  const doctor_ArmyNo = req.user.armyNo;
=======
>>>>>>> c24a89bb5207567a1503d06122631f317bc822f8
  const {
    hypertension,
    diabetesMellitus,
    anyUnnaturalDeath,
    otherSignificantHistory,
    date,
    armyNo,
<<<<<<< HEAD
  } = req.body;

  // console.log(`date:${date}, armyNo:${armyNo}`);
  // console.log(`doctor_Armyno:${doctor_Armyno}`);
=======
    armyNo1,
  } = req.body;
>>>>>>> c24a89bb5207567a1503d06122631f317bc822f8

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
<<<<<<< HEAD
          armyNo: doctor_ArmyNo,
=======
          armyNo: armyNo1,
>>>>>>> c24a89bb5207567a1503d06122631f317bc822f8
          role: 'DOCTOR',
        },
      },
      select: {
        id: true, // Select only the id field
      },
    });
    if (!doctor) {
<<<<<<< HEAD
      throw new apiError(404, 'Doctor not found');
=======
      throw new apiError(HttpStatusCode.BAD_REQUEST, 'Doctor not found');
>>>>>>> c24a89bb5207567a1503d06122631f317bc822f8
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
<<<<<<< HEAD
      res.json(new ApiResponse(200, exfamily, 'Family history updated successfully'));
=======
      res.json(new ApiResponse(HttpStatusCode.OK, exfamily, 'Family history updated successfully'));
>>>>>>> c24a89bb5207567a1503d06122631f317bc822f8
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

<<<<<<< HEAD
    res.json(new ApiResponse(200, family, 'Family history created successfully'));
=======
    res.json(new ApiResponse(HttpStatusCode.OK, family, 'Family history created successfully'));
>>>>>>> c24a89bb5207567a1503d06122631f317bc822f8
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

  // Return all the test reports
<<<<<<< HEAD
  res.json(new ApiResponse(200, ameReports, 'Ame test reports retrieved successfully'));
=======
  res.json(
    new ApiResponse(HttpStatusCode.OK, ameReports, 'Ame test reports retrieved successfully')
  );
>>>>>>> c24a89bb5207567a1503d06122631f317bc822f8
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

  // Return all the test reports
<<<<<<< HEAD
  res.json(new ApiResponse(200, ameReports, 'Ame1 test reports retrieved successfully'));
=======
  res.json(
    new ApiResponse(HttpStatusCode.OK, ameReports, 'Ame1 test reports retrieved successfully')
  );
>>>>>>> c24a89bb5207567a1503d06122631f317bc822f8
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

  // Return all the test reports
<<<<<<< HEAD
  res.json(new ApiResponse(200, ameReports, 'Pme test reports retrieved successfully'));
=======
  res.json(
    new ApiResponse(HttpStatusCode.OK, ameReports, 'Pme test reports retrieved successfully')
  );
>>>>>>> c24a89bb5207567a1503d06122631f317bc822f8
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
<<<<<<< HEAD
  
  const { armyNo, date, bloodHb, TLC, DLC, urineRE, urineSpGravity} = req.body;
  const doctr_ArmyNo=req.user.armyNo;
  
=======
  console.log('you are inside ame1');
  const { armyNo, date, bloodHb, TLC, DLC, urineRE, urineSpGravity, armyNo1 } = req.body;
  console.log(armyNo);
>>>>>>> c24a89bb5207567a1503d06122631f317bc822f8
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
<<<<<<< HEAD

  if (!patient) {
    throw new apiError(404, 'Patient not found');
=======
  if (!patient) {
    throw new apiError(HttpStatusCode.NOT_FOUND, 'Patient not found');
>>>>>>> c24a89bb5207567a1503d06122631f317bc822f8
  }
  const doctor = await prisma.Doctor.findFirst({
    where: {
      status: 'APPROVED',
      user: {
<<<<<<< HEAD
        armyNo: doctr_ArmyNo,
=======
        armyNo: armyNo1,
>>>>>>> c24a89bb5207567a1503d06122631f317bc822f8
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
<<<<<<< HEAD
  res.json(new ApiResponse(200, updatedAME1, 'AME1 test report updated successfully'));
=======
  res.json(
    new ApiResponse(HttpStatusCode.OK, updatedAME1, 'AME1 test report updated successfully')
  );
>>>>>>> c24a89bb5207567a1503d06122631f317bc822f8
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
<<<<<<< HEAD
  const doctr_ArmyNo=req.user.armyNo;
=======
>>>>>>> c24a89bb5207567a1503d06122631f317bc822f8
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
<<<<<<< HEAD
    throw new apiError(404, 'Patient not found');
=======
    throw new apiError(HttpStatusCode.NOT_FOUND, 'Patient not found');
>>>>>>> c24a89bb5207567a1503d06122631f317bc822f8
  }
  const doctor = await prisma.Doctor.findFirst({
    where: {
      status: 'APPROVED',
      user: {
<<<<<<< HEAD
        armyNo: doctr_ArmyNo,
=======
        armyNo: armyNo1,
>>>>>>> c24a89bb5207567a1503d06122631f317bc822f8
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
<<<<<<< HEAD
  res.json(new ApiResponse(200, updatedAME2, 'AME2 test report updated successfully'));
=======
  res.json(
    new ApiResponse(HttpStatusCode.OK, updatedAME2, 'AME2 test report updated successfully')
  );
>>>>>>> c24a89bb5207567a1503d06122631f317bc822f8
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
<<<<<<< HEAD
  const doctr_ArmyNo=req.user.armyNo;
=======

>>>>>>> c24a89bb5207567a1503d06122631f317bc822f8
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
<<<<<<< HEAD
    throw new apiError(404, 'patient not found');
=======
    throw new apiError(HttpStatusCode.NOT_FOUND, 'patient not found');
>>>>>>> c24a89bb5207567a1503d06122631f317bc822f8
  }
  const doctor = await prisma.Doctor.findFirst({
    where: {
      status: 'APPROVED',
      user: {
<<<<<<< HEAD
        armyNo: doctr_ArmyNo,
=======
        armyNo: armyNo1,
>>>>>>> c24a89bb5207567a1503d06122631f317bc822f8
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
<<<<<<< HEAD
    throw new apiError(404, 'PME record not found');
=======
    throw new apiError(HttpStatusCode.NOT_FOUND, 'PME record not found');
>>>>>>> c24a89bb5207567a1503d06122631f317bc822f8
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
