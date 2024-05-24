import { apiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { hashPassword } from '../utils/hashPassword.js';
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
export const CreateDoctorProfile = asyncHandler( async (req, res) => {
  const {unit, rank, firstName, middleName, lastName, dob ,armyNo1,date,password} = req.body;
  // check if all fields are filled
  if (!armyNo1 || !unit || !rank || !firstName || !lastName || !dob || !date) throw new apiError(400, 'All fields are required to create a new user');
  // check if user already exists
  let existedDoctor = await prisma.User.findFirst({
    where: {
      armyNo: armyNo1,
      role:"DOCTOR"
    },
  });
  if (existedDoctor) {
    throw new apiError(HttpStatusCode.BAD_REQUEST, 'Doctor already exists');
  }
  // hash password
  const hashedPassword =  await bcrypt.hash(password,10);
  // create user and store in database
  const refreshToken = generateRefreshToken({ id: armyNo1 });
    
  const user = await prisma.User.create({
    data: {
      armyNo:armyNo1,
      unit,
      rank,
      firstName,
      middleName,
      lastName,
    password: hashedPassword,
      dob: new Date(dob), // Assuming dob is provided as a string in 'YYYY-MM-DD' format
      role: 'DOCTOR', // Default role for this example
      createdAt:new Date(date),
      updatedAt:new Date(date),
      refreshToken,

    },
  });
  const doctor=await prisma.Doctor.create({
    data:{
      userId:user.id,
      specialization:"doctor",
      status:"PENDING",
      createdAt:new Date(date),
      updatedAt:new Date(date),
    }
  })
  const requ=await prisma.Request.create({
    data:{
       status:"PENDING",
       createdAt:new Date(date),
       updatedAt:new Date(date),
       doctorId:doctor.id,
    }
  })
  // return response
  return res.status(200).json(new ApiResponse(200,requ,"Doctor created successfully but not verified"));
});

// Get Personal Info of patient by Army Number
export const getPersonalInfo =  asyncHandler(async (req, res) => {
  console.log('Inside getPersonalInfo function');
  console.log('REFRESH_TOKEN_SECRET:', process.env.REFRESH_TOKEN_SECRET);

  const { unit, rank, firstName, middleName, lastName, email, mobileNo, dob ,armyNo,date} = req.body;

  console.log(armyNo);

  if (!armyNo) {
    throw new apiError(HttpStatusCode.BAD_REQUEST, 'Army number is required');
  }

  let user = await prisma.User.findFirst({
    where: {
      armyNo: armyNo,
    },
  });

  if (!user) {
    // Validation for all required fields
    if (!unit || !rank || !firstName || !lastName || !dob||!date) {
      throw new apiError(HttpStatusCode.BAD_REQUEST, 'All fields are required to create a new user');
    }

    // Generate a refresh token for the new user
    const refreshToken = generateRefreshToken({ id: armyNo });
    console.log (refreshToken);
    user = await prisma.User.create({
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
       createdAt:new Date(date),
       updatedAt:new Date(date)
      },
    });
    
    const userId = user.id; // Assuming you need the user ID for creating a patient entry
    // Create a patient entry for the user
   const  patient = await prisma.Patient.create({
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

  res.json(new ApiResponse(HttpStatusCode.OK, user, 'User retrieved successfully'));
});

// Update Personal Info
export const updatePersonalInfo = asyncHandler(async (req, res, next) => {
  try {
    const { armyNo, unit, rank, dateOfCommission, firstName, middleName, lastName, email, mobileNo, dob, refreshToken } = req.body;

    // Find the user by army number
    const existingUser = await prisma.User.findFirst({
      where: {
        armyNo: armyNo,
      },
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found with the provided army number' });
    }

    // Update the user data
    const updatedUser = await prisma.User.update({
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
        refreshToken // Assuming refreshToken is part of the User model
      },
    });

    res.redirect('/personal-info');
  } catch (error) {
    next(error);
  }
});


// Read Health Record
export const getHealthRecord = asyncHandler(async (req, res, next) => {
  try {
    const { armyNo,date } = req.body;

    // Find the user based on the army number
    const user = await prisma.User.findFirst({
      where: { 
        armyNo: armyNo,
        role:"PATIENT",
       },
    });

    if (!user) {
      throw new apiError(HttpStatusCode.NOT_FOUND, 'User not found');
    }

    // Find the patient based on the userId
    const patient = await prisma.Patient.findFirst({
      where: { userId: user.id },
    });
    if (!patient) {
      throw new apiError(HttpStatusCode.NOT_FOUND, 'Patient not found');
    }

    const medicalRecord = await prisma.Medical.findMany({
      where: { 
        patientId: patient.id,
        createdAt:new Date(date),
      },
    })
    // Extract medical records from the patient
    //const medicalRecords = patient.Medical;

    res.json(new ApiResponse(HttpStatusCode.OK, medicalRecord, 'Health records retrieved successfully'));
  } catch (error) {
    next(error);
  }
});



// Update Health Record
export const updateHealthRecord = asyncHandler(async (req, res, next) => {
  try {
    const { heightCm, weightKg, chest, BMI, waist, bloodPressure, disabilities, bloodGroup, date ,armyNo,armyNo1} = req.body;
    //const armyNo = req.body.armyNo; // Assuming armyNo is available in the request

    // Find the patient by army number
    const patient = await prisma.Patient.findFirst({
      where: {
        user: {
          armyNo: armyNo,
          role:"PATIENT"
        },
      },
      select: {
        id: true, // Select only the id field
      },
    });
    const doctor=await prisma.Doctor.findFirst({
      where:{
        status:"APPROVED",
        user:{
          armyNo:armyNo1,
          role:"DOCTOR",
        }
      }
    })
    if(!doctor){
      throw new apiError(HttpStatusCode.NOT_FOUND, 'Doctor not found with the provided army number');
    }
    // If patient is not found, handle the error
    if (!patient) {
      throw new apiError(HttpStatusCode.NOT_FOUND, 'Patient not found with the provided army number');
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
        doctorId:doctor.id,
        createdAt:new Date(date),
        updatedAt:new Date(date),
      },
    });

    // Send a JSON response in Postman
    res.json(new ApiResponse(HttpStatusCode.OK, newMedicalRecord, 'Medical record created successfully'));
  } catch (error) {
    next(error);
  }
});


// Read Personal Medical History
export const getTreatmentRecord = asyncHandler(async (req, res, next) => {
  const {armyNo,date}=req.body; 
  try {
    const user=await prisma.User.findFirst({
      where:{
        armyNo:armyNo,
        role:"PATIENT",
      }
    })
    const patient = await prisma.Patient.findFirst({
      where: {
        userId: user.id,
      },
      select: {
        id: true, // Select only the id field
      },
    });

    if (!patient) {
      throw new apiError(HttpStatusCode.NOT_FOUND, 'Patient not found');
    }

    const patientId = patient.id;

    // Fetch treatment records associated with the patient
    
    const treatmentRecords = await prisma.treatment.findMany({
      where: {
        patientId,
        createdAt:new Date(date),
      },
      include: {
       diagnosis:true,
       note:true,
       medicationName:true
      },
    });
    

    res.json(new ApiResponse(HttpStatusCode.OK, { treatmentRecords, descriptions }, 'Treatment records retrieved successfully'));
  } catch (error) {
    next(error);
  }
});


// Update Treatment Records
export const updateTreatmentRecord = asyncHandler(async (req, res, next) => {
  try {
    const { diagnosis, note,medicationName,date,armyNo,armyNo1} = req.body;
    
    // Find the patient by army number
    const patient = await prisma.Patient.findFirst({
      where: {
        user: {
          armyNo: armyNo,
          role:"PATIENT"
        },
      },
      select: {
        id: true, // Select only the id field
      },
    });
    const doctor = await prisma.Doctor.findFirst({
      where: {
        status:"APPROVED",
       user:{
        armyNo:armyNo1,
        role:"DOCTOR",
       }
      },
    });
    if(!doctor){
      throw new apiError(HttpStatusCode.NOT_FOUND, 'Doctor not found');
    }
    if(!patient){
      throw new apiError(HttpStatusCode.NOT_FOUND, 'Patient not found');
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
            diagnosis:diagnosis,
            note:note,
            medicationName:medicationName,
            createdAt:new Date(date),
            updatedAt:new Date(date),
            patientId:patientId,
            doctorId:doctor.id,

      },
     
    });

    
    // Accessing related data directly from newMedicalRecord
    res.json(new ApiResponse(HttpStatusCode.OK, newTreatment, 'Treatment record created successfully'));
  } catch (error) {
    next(error);
  }
});


// Read Family History
export const getFamilyHistory = asyncHandler(async (req, res, next) => {
  const {armyNo}=req.body;
  try {
    // Ensure the ID is provided
    const user =await prisma.User.findFirst({
      where:{
        armyNo:armyNo,
        role:"PATIENT"
      }
    })
    const userId=user.id;
    if(!user){
      throw new apiError(HttpStatusCode.BAD_REQUEST, 'User not found');
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
      throw new apiError(HttpStatusCode.BAD_REQUEST, 'patient not found');
    }

    const patientId = patient.id;
    const familyhistories = await prisma.familyHistory.findMany({
      where: {
        patientId,
      },
    });

    res.json(new ApiResponse(HttpStatusCode.OK, familyHistories, 'Family history records retrieved successfully'));
  } catch (error) {
    console.error("Failed to retrieve family history:", error);
    res.status(500).json({ error: "Internal server error." });
    next(error);
  }
});


// Update Family History
export const updateFamilyHistory = asyncHandler(async (req, res, next) => {
  const {hypertension,diabetesMellitus,anyUnnaturalDeath,otherSignificantHistory,date,armyNo,armyNo1}=req.body;

  try {
    console.log("updatefamilyhistoryroute");
    const user=await prisma.User.findFirst({
      where:{
        armyNo:armyNo,
        role:"PATIENT"
      }
    })
    const patient = await prisma.Patient.findFirst({
      where: {
        userId: user.id,
      },
    });
    const doctor = await prisma.Doctor.findFirst({
      where: {
        status:"APPROVED",
        user: {
          armyNo: armyNo1,
          role:"DOCTOR",
        },
      },
      select: {
        id: true, // Select only the id field
      },
    });
    if(!doctor){
      throw new apiError(HttpStatusCode.BAD_REQUEST, 'Doctor not found');
    }
    if (!patient) {
      throw new apiError(HttpStatusCode.BAD_REQUEST, 'Patient not found');
    }
    const patientId = patient.id;
    const existfamily=await prisma.familyHistory.findFirst({
      where:{
       patientId:patientId,
       doctorId:doctor.id,
      }
    })
   if(existfamily){
   const exfamily= await prisma.familyHistory.update({
      where:{
        patientId:patientId,
        doctorId:doctor.id,
      },
      data:{
        hypertension,
        diabetesMellitus,
        anyUnnaturalDeath,
        otherSignificantHistory,
        createdAt:new Date(date),
      }
    })
    res.json(new ApiResponse(HttpStatusCode.OK, exfamily, 'Family history updated successfully'));
   }
   const family=await prisma.familyHistory.create({
    data:{
      hypertension:hypertension,
      diabetesMellitus:diabetesMellitus,
      anyUnnaturalDeath:anyUnnaturalDeath,
      otherSignificantHistory:otherSignificantHistory,
      patientId:patientId,
      doctorId:doctor.id,
      createdAt:new Date(date),
    }
   })
    
   res.json(new ApiResponse(HttpStatusCode.OK, family, 'Family history created successfully'));
  } catch (error) {
    next(error);
  }
});

export const getAllTestReports = asyncHandler(async (req, res) => {
  const { armyNo ,date} = req.body;

  // Find the user by army number
  const user = await prisma.User.findFirst({
    where: { armyNo ,role:"PATIENT"},
    select: { id: true },
  });

  // If user not found, throw an error
  if (!user) {
    throw new apiError(HttpStatusCode.NOT_FOUND, 'User not found');
  }
 const patient=await prisma.Patient.findFirst({
  where:{
    userId:user.id,
  }
 })
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
      (age > 51 && age <= 53) || (age > 54 && age <= 57) || (age >58 && age <= 59)) {
    return 'AME2';
  } else if ((age >= 35 && age <= 36) || (age >= 40 && age <= 41) || (age >= 45 && age <= 46) ||
             (age > 50 && age <= 51) || (age >53 && age <= 54) || (age > 57 && age <= 58)) {
    return 'PME';
  } else {
    return 'AME1';
  }
};

//Function to update AME1
export const updateAME1 = asyncHandler(async (req, res) => {
  // Extract required parameters from request body
  console.log("you are inside ame1");
  const { armyNo, date, bloodHb, TLC, DLC, urineRE, urineSpGravity,armyNo1 } = req.body;
  console.log(armyNo);
  const user =await prisma.User.findFirst({
    where:{
      armyNo:armyNo,
    }
  })
  
  const patient =await prisma.Patient.findFirst({
    where:{
      userId:user.id,
    }
  })
  if(!patient){
    throw new apiError(HttpStatusCode.NOT_FOUND, 'Patient not found');
  }
  const doctor = await prisma.Doctor.findFirst({
    where: {
      status:"APPROVED",
      user: {
        armyNo: armyNo1,
        role:"DOCTOR"
      },
    },
    select: {
      id: true, // Select only the id field
    },
  });

  // Find the existing AME1 record by ID
  const ame1 = await prisma.AME.findFirst({
    where: { patientId:patient.id},
  });

  // If AME1 record not found, throw an error
  if (!ame1) {
    throw new apiError(HttpStatusCode.NOT_FOUND, 'AME1 record not found');
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
      createdAt:new Date(date),
      patientId:patient.id,
      description,
      doctorId:doctor.id,
    },
  });

  // Send response with updated AME1 record
  res.json(new ApiResponse(HttpStatusCode.OK, updatedAME1, 'AME1 test report updated successfully'));
});

//Function to update AME2
export const updateAME2 = asyncHandler(async (req, res) => {
  // Extract required parameters from request body
  console.log("AME2");
  const {
    armyNo,
    armyNo1,
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
  const user =await prisma.User.findFirst({
    where:{
      armyNo:armyNo,
    }
  })
  const patient =await prisma.Patient.findFirst({
    where:{
      userId:user.id,
    }
  })
  if(!patient){
    throw new apiError(HttpStatusCode.NOT_FOUND, 'Patient not found');
  }
  const doctor = await prisma.Doctor.findFirst({
    where: {
      status:"APPROVED",
      user: {
        armyNo: armyNo1,
        role:"DOCTOR"
      },
    },
    select: {
      id: true, // Select only the id field
    },
  });
  // Find the existing AME2 record by ID
  const ame2 = await prisma.AME2.findFirst({
    where: {patientId:patient.id, doctorId:doctor.id},
  });
  
  // If AME2 record not found, throw an error
  if (!ame2) {
    throw new apiError(HttpStatusCode.NOT_FOUND, 'AME2 record not found');
  }
  const description=JSON.stringify({
    bloodHb,
      TLC,
      DLC,
      urineRE,
      urineSpGravity,
      bloodSugarFasting,
      bloodSugarPP,
      restingECG,
  })
  // Update the AME2 record with new data
  const updatedAME2 = await prisma.AME2.create({
    data: {
      date: new Date(date),
      createdAt:new Date(date),
      patientId:patient.id,
      doctorId:doctor.id,
      description,
    },
  });

  // Send response with updated AME2 record
  res.json(new ApiResponse(HttpStatusCode.OK, updatedAME2, 'AME2 test report updated successfully'));
});

//Function to update PME
export const updatePME = asyncHandler(async (req, res) => {
  // Extract required parameters from request body
  const {
    armyNo,
    armyNo1,
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

  const user =await prisma.User.findFirst({
    where:{
      armyNo:armyNo,
    }
  })
  const patient =await prisma.Patient.findFirst({
    where:{
      userId:user.id,
    }
  })
  if(!patient){
    throw new apiError(HttpStatusCode.NOT_FOUND, 'patient not found');
  }
  const doctor = await prisma.Doctor.findFirst({
    where: {
      status:"APPROVED",
      user: {
        armyNo: armyNo1,
        role:"DOCTOR"
      },
    },
    select: {
      id: true, // Select only the id field
    },
  });
  // Find the existing PME record by ID
  const pme = await prisma.PME.findUnique({
    where: {patientId:patient.id},
  });

  // If PME record not found, throw an error
  if (!pme) {
    throw new apiError(HttpStatusCode.NOT_FOUND, 'PME record not found');;
  }
  const description=JSON.stringify({
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
  })
  // Update the PME record with new data
  const updatedPME = await prisma.pME.create({
    data: {
      date: new Date(date),
      createdAt:new Date(date),
      patientId:patient.id,
      doctorId:doctor.id,
      description,
    },
  });

  // Send response with updated PME record
  res.json(new ApiResponse(HttpStatusCode.OK, updatedPME, 'PME test report updated successfully'));
});

// Route to add a test report
export const addTestReport = asyncHandler(async (req, res) => {
  console.log("you are inside testreport route");
  const { armyNo } = req.body;
  
  // Fetch user's date of birth using army number
  const user = await prisma.User.findFirst({
    where: { armyNo,role:"PATIENT" },
    select: { dob: true },
  });
  console.log(user);
  if (!user || !user.dob) {
    throw new apiError(HttpStatusCode.NOT_FOUND, 'User not found or date of birth not available');
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
      updatedTest = await updateAME1(req,res);
      break;
    case 'AME2':
      updatedTest = await updateAME2(req,res);
      break;
    case 'PME':
      updatedTest = await updatePME(req,res);
      break;
    default:
      throw new apiError(HttpStatusCode.BAD_REQUEST, 'Invalid test type');
  }
  res.json(new ApiResponse(HttpStatusCode.OK, updatedTest, 'Test report added successfully'));
});

  
  // Error handling middleware
  export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
    });
  };
