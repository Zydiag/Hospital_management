// import { apiError } from "../utils/apiError.js";
// import { apiResponse } from "../utils/apiResponse.js";
// import { asynchandler } from "../utils/asyncHandler.js";
// import jwt from "jsonwebtoken";
import pkg from 'pg';

// Now you can use Client as before

import { PrismaClient } from '@prisma/client';
import { create } from 'domain';
const { Client } = pkg;

const prisma = new PrismaClient();

// Create or Get Personal Info by Army Number
export const getPersonalInfo = async (req, res) => {
  console.log('Inside getPersonalInfo function');
  const { unit, rank, firstName, middleName, lastName, email, mobileNo, dob } = req.body;
  const armyNo = req.body.armyNo;
  console.log(armyNo);
  if (!armyNo) {
    console.log(req.body);
      return res.status(400).json({
          "error": "Army number is required"
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
        console.log("abs");
        return res.status(400).json({ error: 'All fields are required to create a new user' });
      }
  
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
    }
  
    res.json(user);
  };
  
  

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
    const patient = await prisma.user.findUnique({
      where: { id: req.body.id },
      include: { patient: true },
    });

    const patientId = patient.patient.id;
    const medicalRecord = await prisma.medicalRecord.findUnique({
      where: {
        patientId,
      },
    });
    res.render('familyHistoryForm', { medicalRecord });
  } catch (error) {
    next(error);
  }
};

// Update Family History
export const updateFamilyHistory = async (req, res, next) => {
  try {
    const { hypertension, diabetes, unnaturalDeath, otherHistory } = req.body;
    const patient = await prisma.user.findUnique({
      where: { id: req.body.id },
      include: { patient: true },
    });

    const patientId = patient.patient.id;

    const newMedicalRecord = await prisma.medicalRecord.create({
      data: {
        hypertension,
        diabetes,
        unnaturalDeath,
        otherHistory,
        patientId,
      },
    });
    res.redirect('/family-history');
  } catch (error) {
    next(error);
  }
};

  
  // Delete Present Referral Details
  // export const deletePresentReferralDetails = async (req, res, next) => {
  //   try {
  //     const { testId } = req.body;
  
  //     await prisma.test.delete({
  //       where: {
  //         id: testId,
  //       },
  //     });
  //     res.redirect('/present-referral-details');
  //   } catch (error) {
  //     next(error);
  //   }
  // };
  
  // Other necessary functions can be added similarly
  
  // Error handling middleware
  export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
    });
  };

  
  
  