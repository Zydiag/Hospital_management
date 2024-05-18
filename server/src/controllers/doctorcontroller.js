import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asynchandler } from '../utils/asyncHandler.js';
import { hashPassword } from '../utils/hashPassword.js';
// import jwt from "jsonwebtoken";
import pkg from 'pg';

// Now you can use Client as before

import { PrismaClient } from '@prisma/client';
const { Client } = pkg;

const prisma = new PrismaClient();

//create Doctor profile
const CreateDoctorProfile = asynchandler(async (req, res) => {
  const { armyNo, unit, rank, firstName, middleName, lastName, email, mobileNo, dob,password} = req.body;
  // check if all fields are filled
  if (!armyNo || !unit || !rank || !firstName || !lastName || !dob || !password) throw new apiError(400, 'All fields are required to create a new user');
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
  user = await prisma.user.create({
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
    }
  })
 if (!user) {
    throw new apiError(505, 'Something went wrong while registering user');
  }
  const newDoctorRequest = await prisma.Request.create({
    data: {
      armyNo,
      firstName,
      lastName,
      unit,
      rank
    },
  });
  // return response
  return res.status(200).json(new apiResponse(200, createdDoctor, 'Doctor created successfully but it is not verified yet'));
});

// Get Personal Info of patient by Army Number
export const getPersonalInfo = asynchandler(async (req, res) => {
  const { armyNo } = req.body;
  if (!armyNo) {
    throw new apiError(400, 'army number  required');
  }
  let user = await prisma.user.findFirst({
    where: {
      armyNo: armyNo,
    },
  });
  if (!user) {
    throw new apiError(404, 'User not found');
  }
  return res.status(200).json(
    new apiResponse(
      200,
      {
        // user info (past history or something else)
      },
      'user fetched successfully'
    )
  );
});

// Create patient profile
export const createPatientProfile = asynchandler(async (req, res) => {
  console.log('Inside getPersonalInfo function');
  const { unit, rank, firstName, middleName, lastName, email, mobileNo, dob } = req.body;
  const armyNo = req.body.armyNo;
  console.log(armyNo);
  if (!armyNo) {
    // console.log(req.body);
    throw new apiError(400, 'army number  required');
  }

  let user = await prisma.user.findFirst({
    where: {
      armyNo: armyNo,
    },
  });

  if (!user) {
    // Validation for all required fields
    if (!unit || !rank || !firstName || !lastName || !dob) throw new apiError(400, 'All fields are required to create a new user');

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
      },
    });
  } else {
    throw new apiError(400, 'User already exists');
  }

  res.json(user);
});

// Update Personal Info
export const updatePersonalInfo = async (req, res, next) => {
  try {
    const { armyNo, unit, rank,dateOfCommission, firstName, middleName, lastName, email, mobileNo, dob } = req.body;
    console.log(req.body.armyNo);
    const userId = req.body.id;
    
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        armyNo,
        unit,
        rank,
        dateOfCommission,
        firstName,
        middleName,
        lastName,
        email,
        mobileNo,
        dob,
      },
    });

    await prisma.patient.create({
      data: {
        userId: user.id,
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
    const patient = await prisma.user.findUnique({
      where: { id: req.body.id },
      include: { patient: true },
    });

    const patientId = patient.patient.id;
    const medicalRecord = await prisma.Medical.findMany({
      where: {
        patientId,
      },
    });

    res.json({ Medical }); // Changed to medicalRecord
  } catch (error) {
    next(error);
  }
};


// Update Health Record
export const updateHealthRecord = async (req, res, next) => {
  try {
    const { heightCm, weightKg, chest,BMI, waist, bloodPressure, disabilities, bloodGroup, onDrug,date } = req.body;

    const patient = await prisma.user.findUnique({
      where: { id: req.body.id },
      include: { patient: true },
    });

    const patientId = patient.patient.id;

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
    res.redirect('/health-record');
  } catch (error) {
    next(error);
  }
};

// Read Personal Medical History
export const getTreatmentRecord = async (req, res, next) => {
  try {
    const patient = await prisma.user.findUnique({
      where: { id: req.body.id },
      include: { patient: true },
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const patientId = patient.patient.id;

    // Fetch treatment records associated with the patient
    const treatmentRecords = await prisma.treatment.findMany({
      where: {
        patientId,
      },
      include: {
        Medication: true
      },
    });

    // Extract medication records from treatment records
    const medicationRecords = treatmentRecords.flatMap(record => record.Medication);

    res.json({
      treatmentRecords,
      medicationRecords
    });
  } catch (error) {
    next(error);
  }
};


// Update Treatment Records
export const updateTreatmentRecord = async (req, res, next) => {
  try {
    const { problemDes, medication, medicationDes, } = req.body;
    const patient = await prisma.user.findUnique({
      where: { id: req.body.id },
      include: { patient: true },
    });

    const patientId = patient.patient.id;

    const newTreatment = await prisma.Treatment.create({
      data: {
            description:problemDes,
            doctorId: doctorId,
            patientId,

      },
     
    });

    const newMedication = await prisma.Medication.create({
      data: {
        name: medication,
        description: medicationDes,
        Treatment: {
          connect: { id: treatmentId }, // Connect the medication to the specified treatment
        },
      },
    });
    // Accessing related data directly from newMedicalRecord
    res.json({
      newTreatment,
      newMedication
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
      return res.status(400).json({ error: "User ID must be provided." });
    }

    const patient = await prisma.user.findUnique({
      where: { id: userId },
      include: { patient: true },
    });

    // Check if patient information exists
    if (!patient || !patient.patient) {
      return res.status(404).json({ error: "Patient not found." });
    }

    const patientId = patient.patient.id;
    const medical = await prisma.Medical.findMany({
      where: {
        patientId,
      },
      include: {
        familyhistories: true
      },
    });

    // Flatten family histories from medical records
    const familyhistories = Medical.flatMap(record => record.familyhistories);

    // Check if family histories are found
    if (familyhistories.length === 0) {
      return res.status(404).json({ message: "No family history records found." });
    }

    res.json({ familyhistories });
  } catch (error) {
    console.error("Failed to retrieve family history:", error);
    res.status(500).json({ error: "Internal server error." });
    next(error);
  }
};


// Update Family History
export const updateFamilyHistory = async (req, res, next) => {
  try {
    console.log("updatefamilyhistoryroute");
    const { hypertension, diabetesMellitus, anyUnnaturalDeath, otherSignificantHistory } = req.body;
    const patient = await prisma.user.findUnique({
      where: { id: req.body.id },
      include: { patient: true },
    });

    if (!patient || !patient.patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    const patientId = patient.patient.id;

    const newMedicalRecord = await prisma.Medical.create({
      data: {
        patientId: patientId,
        familyhistories: {
          create: {
            hypertension,
            diabetesMellitus,
            anyUnnaturalDeath,
            otherSignificantHistory
          }
        },
      },
      include: {
        familyhistories: true
      }
    });
    
    res.status(200).json({ message: "Family history updated", data: newMedicalRecord });
  } catch (error) {
    next(error);
  }
};


  
  // Other necessary functions can be added similarly
  
  // Error handling middleware
  export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
    });
  };
  
  
  
