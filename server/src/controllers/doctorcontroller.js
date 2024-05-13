// import { apiError } from "../utils/apiError.js";
// import { apiResponse } from "../utils/apiResponse.js";
// import { asynchandler } from "../utils/asyncHandler.js";
// import jwt from "jsonwebtoken";
import pkg from 'pg';

// Now you can use Client as before

import { PrismaClient } from '@prisma/client';
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
    const { armyNo, unit, rank, firstName, middleName, lastName, email, mobileNo, dob } = req.body;
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
    const medicalRecord = await prisma.medicalRecord.findMany({
      where: {
        patientId,
      },
    });

    res.json({ medicalRecord }); // Changed to medicalRecord
  } catch (error) {
    next(error);
  }
};


// Update Health Record
export const updateHealthRecord = async (req, res, next) => {
  try {
    const { heightCm, weightKg, chest, waist, bloodPressure, disabilities, bloodGroup, onDrug } = req.body;

    const patient = await prisma.user.findUnique({
      where: { id: req.body.id },
      include: { patient: true },
    });

    const patientId = patient.patient.id;

    const newMedicalRecord = await prisma.medicalRecord.create({
      data: {
        heightCm,
        weightKg,
        chest,
        waist,
        bloodPressure,
        disabilities,
        bloodGroup,
        onDrug,
        patientId,
      },
    });
    res.redirect('/health-record');
  } catch (error) {
    next(error);
  }
};

// Read Personal Medical History
export const getPersonalMedicalHistory = async (req, res, next) => {
  try {
    const patient = await prisma.user.findUnique({
      where: { id: req.body.id },
      include: { patient: true },
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const patientId = patient.patient.id;

    // Fetch medical records associated with the patient
    const medicalRecords = await prisma.medicalRecord.findMany({
      where: {
        patientId,
      },
      include: {
        ames: true, // Include related ame records
        pmes: true, // Include related pme records
      },
    });

    // Extract ame and pme records from medical records
    const ames = medicalRecords.flatMap(record => record.ames);
    const pmes = medicalRecords.flatMap(record => record.pmes);

    // Fetch treatment records associated with the patient
    const treatments = await prisma.treatment.findMany({
      where: {
        patientId,
      }
    });

    res.json({
      treatments,
      ames,
      pmes,
      //medicalRecords, // Optionally include medical records if needed
    });
  } catch (error) {
    next(error);
  }
};



// Update Personal Medical History
export const updatePersonalMedicalHistory = async (req, res, next) => {
  try {
    const { presentmedicationDes, pastmedicationDes, pasthospitalisationDes, significantpasthistoryDes, knownallergiesDes, miscellaneousDes,  ameDescription, pmeDescription, onDrug } = req.body;
    const patient = await prisma.user.findUnique({
      where: { id: req.body.id },
      include: { patient: true },
    });

    const patientId = patient.patient.id;

    const newMedicalRecord = await prisma.medicalRecord.create({
      data: {
        treatments: {
          create:{
            presentmedication: presentmedicationDes,
            pastmedication: pastmedicationDes,
            pasthospitalisation: pasthospitalisationDes,
            significantpasthistory: significantpasthistoryDes ,
            knownallergies: knownallergiesDes ,
            miscellaneous: miscellaneousDes ,
            //doctorId: doctorId,
          }
        },
        ames: {
          create: {
            description: ameDescription,
          },
        },
        pmes: {
          create: {
            description: pmeDescription,
          },
        },
        onDrug: onDrug, // Include the onDrug field
        patientId,
      },
      include: {
        ames: true,
        pmes: true,
        treatments: true
      },
    });
    // Accessing related data directly from newMedicalRecord
    res.json({
      ames: newMedicalRecord.ames,
      pmes: newMedicalRecord.pmes,
      treatments: newMedicalRecord.treatments
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
  
  
  
