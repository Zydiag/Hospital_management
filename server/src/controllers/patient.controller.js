import { apiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { hashPassword } from '../utils/hashPassword.js';
import { generateAccessAndRefreshToken } from '../utils/tokenGenerate.js';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

export const profilepatient = asyncHandler(async (req, res) => {
  console.log('you are inside patient profile creation');
  const { armyNo, dob, fullname, password } = req.body;
  console.log('step1');
  if (!armyNo || !password || !dob || !fullname) {
    throw new apiError(501, 'all feilds are required');
  }
  console.log('step2');
  const user = await prisma.user.findFirst({ where: { armyNo, role: 'PATIENT' } });
  if (!user) {
    throw new apiError(404, 'Access Denied/User is not registered by doctor');
  }
  console.log('step3');
  if (user.password != null) {
    console.log('user.password', user.password);
    throw new apiError(400, 'Patient already exists');
  }
  console.log(user);
  if (user.password == null) {
    const hashedPassword = await hashPassword(password);
    const parsedDob = new Date(dob);
    const newUser = await prisma.user.update({
      where: {
        armyNo,
      },
      data: {
        dob: parsedDob,
        fullname: fullname,
        password: hashedPassword,
      },
    });
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(newUser);
    await prisma.user.update({
      where: {
        armyNo,
      },
      data: { refreshToken },
    });
    console.log(`accessToken, refreshToken`);
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          user: newUser,
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
      fullname: true,
      unit: true,
      dob: true,
    },
  });
  if (!user) {
    throw new apiError(404, 'user not found');
  }

  res.json(new ApiResponse(200, user, 'user personal info:'));
});
//for fetching all dates between range
export const getUpdatedDates = asyncHandler(async (req, res, next) => {
  try {
    const { armyNo, startDate, endDate } = req.body;

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

    // Create the start and end dates for the specified year

    // Find medical records within the specified date range
    const medicalRecords = await prisma.Medical.findMany({
      where: {
        patientId: patient.id,
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
    });

    // Extract unique dates from the medical records
    const dates = [
      ...new Set(medicalRecords.map((record) => record.createdAt.toISOString().split('T')[0])),
    ];

    res.json(new ApiResponse(200, dates, 'Updated dates retrieved successfully'));
  } catch (error) {
    next(error);
  }
});
// export const getUpdatedDatesAME = asyncHandler(async (req, res, next) => {
//   console.log(req.body);
//   try {
//     const { armyNo, startDate, endDate } = req.body;
//     const user = await prisma.User.findFirst({
//       where: {
//         armyNo: armyNo,
//         role: 'PATIENT',
//       },
//     });
//
//     if (!user) {
//       throw new apiError(404, 'User not found');
//     }
//     const patient = await prisma.Patient.findFirst({
//       where: { userId: user.id },
//     });
//     if (!patient) {
//       throw new apiError(404, 'Patient not found');
//     }
//     const start = new Date(new Date(startDate).setUTCHours(0, 0, 0, 0));
//     const end = new Date(new Date(endDate).setUTCHours(23, 59, 59, 999));
//     const ame1Records = await prisma.AME.findMany({
//       where: {
//         patientId: patient.id,
//         createdAt: {
//           // gte: new Date(startDate),
//           // lte: new Date(endDate),
//           gte: start,
//           lte: end,
//         },
//       },
//       orderBy: {
//         createdAt: 'desc',
//       },
//     });
//
//     // Extract unique dates from the medical records
//     const dates = ame1Records.map((record) => record.createdAt.toISOString());
//
//     // const dates = [
//     //   ...new Set(medicalRecords.map((record) => record.createdAt.toISOString().split('T')[0])),
//     // ];
//
//     res.json(new ApiResponse(200, dates, 'AME  Updated dates retrieved successfully'));
//   } catch (error) {
//     next(error);
//   }
// });

export const getUpdatedDatesAME1 = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  try {
    const { armyNo, startDate, endDate } = req.body;
    const user = await prisma.User.findFirst({
      where: {
        armyNo: armyNo,
        role: 'PATIENT',
      },
    });

    if (!user) {
      throw new apiError(404, 'User not found');
    }
    const patient = await prisma.Patient.findFirst({
      where: { userId: user.id },
    });
    if (!patient) {
      throw new apiError(404, 'Patient not found');
    }
    const start = new Date(new Date(startDate).setUTCHours(0, 0, 0, 0));
    const end = new Date(new Date(endDate).setUTCHours(23, 59, 59, 999));
    const ame1Records = await prisma.AME2.findMany({
      where: {
        patientId: patient.id,
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
          //gte: start,
          //lte: end,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Extract unique dates from the medical records
    const dates = ame1Records.map((record) => record.createdAt.toISOString());

    // const dates = [
    //   ...new Set(medicalRecords.map((record) => record.createdAt.toISOString().split('T')[0])),
    // ];

    res.json(new ApiResponse(200, dates, 'AME 1 Updated dates retrieved successfully'));
  } catch (error) {
    next(error);
  }
});

export const getUpdatedDatesAME = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  try {
    const { armyNo, startDate, endDate } = req.body;
    const user = await prisma.User.findFirst({
      where: {
        armyNo: armyNo,
        role: 'PATIENT',
      },
    });

    if (!user) {
      throw new apiError(404, 'User not found');
    }
    const patient = await prisma.Patient.findFirst({
      where: { userId: user.id },
    });
    if (!patient) {
      throw new apiError(404, 'Patient not found');
    }
    const start = new Date(new Date(startDate).setUTCHours(0, 0, 0, 0));
    const end = new Date(new Date(endDate).setUTCHours(23, 59, 59, 999));
    const ameRecords = await prisma.AME.findMany({
      where: {
        patientId: patient.id,
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
          // gte: start,
          // lte: end,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Extract unique dates from the medical records
    const dates = ameRecords.map((record) => record.createdAt.toISOString());

    // const dates = [
    //   ...new Set(medicalRecords.map((record) => record.createdAt.toISOString().split('T')[0])),
    // ];

    res.json(new ApiResponse(200, dates, 'ame Updated dates retrieved successfully'));
  } catch (error) {
    next(error);
  }
});

export const getUpdatedDatesPME = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  try {
    const { armyNo, startDate, endDate } = req.body;
    const user = await prisma.User.findFirst({
      where: {
        armyNo: armyNo,
        role: 'PATIENT',
      },
    });

    if (!user) {
      throw new apiError(404, 'User not found');
    }
    const patient = await prisma.Patient.findFirst({
      where: { userId: user.id },
    });
    if (!patient) {
      throw new apiError(404, 'Patient not found');
    }
    const start = new Date(new Date(startDate).setUTCHours(0, 0, 0, 0));
    const end = new Date(new Date(endDate).setUTCHours(23, 59, 59, 999));
    const pmeRecords = await prisma.PME.findMany({
      where: {
        patientId: patient.id,
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
          // gte: start,
          // lte: end,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Extract unique dates from the medical records
    const dates = pmeRecords.map((record) => record.createdAt.toISOString());

    // const dates = [
    //   ...new Set(medicalRecords.map((record) => record.createdAt.toISOString().split('T')[0])),
    // ];

    res.json(new ApiResponse(200, dates, 'PME Updated dates retrieved successfully'));
  } catch (error) {
    next(error);
  }
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
      createdAt: new Date(date),
    },
    select: {
      diagnosis: true,
      description: true,
    },
  });
  const parseddescription = JSON.parse(description);
  const info = {
    diagnosis: treat.diagnosis,
    note: parseddescription.note,
    medicationName: parseddescription.medicationName,
    knownAllergies: parseddescription.knownAllergies,
    miscellaneous: parseddescription.miscellaneous,
  };

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
  const ameReports = await prisma.PME.findMany({
    where: { patientId: patient.id, createdAt: new Date(date) },
  });
  console.log(ameReports);
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
