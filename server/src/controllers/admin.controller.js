import { APIError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { hashPassword } from '../utils/hashPassword.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
//
const generateAccessAndRefreshToken = asyncHandler(async (user) => {
  try {
    const accessToken = jwt.sign({ id: user.id}, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign({ id:user.id}, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '8h',
    });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log('error: ', error);
    throw new APIError(500, 'Something went wrong while generating access and refresh token');
  }
});

// create admin profile

export const createAdmin = asyncHandler(async (req, res) => {
  const { adminId, firstName, lastName, email, dob, password } = req.body;
  // Check if all fields are filled
  if (!adminId || !firstName || !dob || !password) {
    throw new APIError(400, 'All fields are required to create a new user');
  }
  const armyNo= adminId;
  const parsedDob = new Date(dob);
  // Hash password
  const hashedPassword = await hashPassword(password);
  try {
    const newUser = await prisma.user.create({
      data: {
        armyNo,
        firstName,
        lastName,
        email,
        dob: parsedDob,
        role: 'ADMIN',
        password: hashedPassword,
      },
    });
    const finduser= await prisma.user.findFirst({
      where: {
        armyNo
      }
    })
    const newAdmin = await prisma.admin.create({
      data: {
        userId: finduser.id,
        adminId,
        password: hashedPassword,
      },
    });
    res.status(201).json(newAdmin);
  } catch (error) {
    throw new APIError(401, error?.message || 'Something went wrong while creating doctor request');
  }
});

//for fetching doctor's profile

export const getDoctorProfile=asyncHandler(async(req,res)=>{
  //armyNo:-armyNo of doctor;
  const {armyNo}=req.body;
  const user =await prisma.user.findFirst({
    where:{
      armyNo:armyNo,
      role:"DOCTOR",
    },
    select:{
      armyNo:true,
      firstName:true,
    }
  })
  const doctor=await prisma.doctor.findFirst({
    where:{
      userId:user.id,
    },
    select:{
      specialization:true,
      status:true
    }

  })
  if(!user){
    throw new APIError(400, 'Doctor not found');
  }
  let ourDoctor={
    armyNo:user.armyNo,
    firstName:user.firstName,
    specialization:doctor.specialization,
    status:doctor.status
  }
  res.json(new ApiResponse(HttpStatusCode.OK, ourDoctor,"Doctor's Credentials:-"));
})

//Admin login
export const loginAdmin = asyncHandler(async (req, res) => {
  const { adminId, password } = req.body;

  // check if all fields are filled
  if (!adminId) {
    throw new APIError(400, 'id  required');
  }
  if (!password) {
    throw new APIError(400, 'password  required');
  }

  // check if user exists
  const Admin = await prisma.admin.findFirst({
    where: {
      adminId,
    },
  });

  if (!Admin) {
    throw new APIError(404, 'User not found');
  }

  // check if password is correct
  const isCorrect = await bcrypt.compare(password, Admin.password);
  if (!isCorrect) {
    throw new APIError(401, 'Incorrect password');
  }
const user= await prisma.user.findUnique({
  where: {
    id: Admin.userId
  }
})
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user);
  await prisma.user.update({
    where: {
      id: Admin.userId,
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
        'User logged in successfully'
      )
    );
});

// fetch  doctor requests which is not approved(pending)
export const pendingRequests = asyncHandler(async (req, res)=> {
  try {
    const requests = await prisma.request.findMany({
      where: {
        status: 'PENDING',
      },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                firstName: true,
                middleName: true,
                lastName: true,
                armyNo: true,
                unit: true,
              },
            },
          },
        },
      },
    });

    const formattedRequests = requests.map(request => ({
      userId: request.doctor.id,
      fullName: `${request.doctor.user.firstName} ${request.doctor.user.middleName ?? ''} ${request.doctor.user.lastName}`.trim(),
      armyNo: request.doctor.user.armyNo,
      unit: request.doctor.user.unit,
      status: request.status,
      specialization: request.doctor.specialization,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
    }));

    res.json(formattedRequests);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the requests." });
  }
});

// fetch  doctor requests which is approved(Accepted)
export const approvedRequests = asyncHandler( async (req, res) => {
  try {
    const requests = await prisma.request.findMany({
      where: {
        status: 'ACCEPTED',
      },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                firstName: true,
                middleName: true,
                lastName: true,
                armyNo: true,
                unit: true,
              },
            },
          },
        },
      },
    });

    const formattedRequests = requests.map(request => ({
      userId: request.doctor.id,
      fullName: `${request.doctor.user.firstName} ${request.doctor.user.middleName ?? ''} ${request.doctor.user.lastName}`.trim(),
      armyNo: request.doctor.user.armyNo,
      unit: request.doctor.user.unit,
      status: request.status,
      specialization: request.doctor.specialization,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
    }));

    res.json(formattedRequests);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the requests." });
  }
});


// approve request
export const approveRequest = asyncHandler(async (req, res)=> {
  const { doctorId } = req.body;
  const request = await prisma.request.findUnique({ where: { doctorId } });
  if (!request) {
    throw new APIError(404, 'Request not found');
  }
  
  const updatedRequest = await prisma.doctor.update({
    where: {id: doctorId },
    data: { status: 'APPROVED' },
  });
  console.log(updatedRequest);
});
// reject request
export const rejectRequest = asyncHandler(async (req, res) => {
  const { doctorId } = req.body;
  const request = await prisma.request.findUnique({ where: {id: doctorId } });
  if (!request) {
    throw new APIError(404, 'Request not found');
  }
  const updatedRequest = await prisma.doctor.update({
    where: { doctorId },
    data: { status: 'REJECTED' },
  });
  // clear the request after rejection
  await prisma.request.delete({ where: { doctorId } });
  res.json(updatedRequest);
});


// reject(block) accepted Doctor
export const blokingAcceptedDoctor = asyncHandler(async (req, res) => {
  const { doctorId } = req.body;
  const request = await prisma.request.findUnique({ where: { doctorId } });
  if (!request) {
    throw new APIError(404, 'Request not found');
  }
  const updatedRequest = await prisma.doctor.update({
    where: { doctorId },
    data: { status: 'REJECTED' },
  });
  // clear the request after rejection
  await prisma.request.delete({ where: { doctorId } });
  res.json(updatedRequest);
});


// Admin Logout
export const logoutAdmin = asyncHandler(async (req, res) => {
  console.log(`req.user.id: ${req.user.id}`);
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
    .json(new ApiResponse(200, {}, 'Admin logout successfully'));
});
// Get Current User
export const getCurrentUser = asyncHandler(async (req, res) => {
  console.log(`req.user.id: ${req.user.id}`);
  return res
    .status(200)
    .json(new ApiResponse(200, req.user.firstName, "User fetched successfully"));
});