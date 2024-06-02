import { apiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { hashPassword } from '../utils/hashPassword.js';
import { generateAccessAndRefreshToken } from '../utils/tokenGenerate.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// create admin profile

export const createAdmin = asyncHandler(async (req, res) => {
  const { armyNo, firstName, dob, password } = req.body;

  const adminId = armyNo;
  // Check if all fields are filled
  if (!adminId || !firstName || !dob || !password) {
    throw new apiError(400, 'All fields are required to create a new user');
  }
  const parsedDob = new Date(dob);
  // Hash password
  const hashedPassword = await hashPassword(password);
  try {
    const newUser = await prisma.user.create({
      data: {
        armyNo,
        firstName,
        dob: parsedDob,
        role: 'ADMIN',
        password: hashedPassword,
      },
    });
    const finduser = await prisma.user.findFirst({
      where: {
        armyNo,
      },
    });
    const newAdmin = await prisma.admin.create({
      data: {
        userId: finduser.id,
        adminId,
        password: hashedPassword,
      },
    });

    if (!newAdmin) {
      throw new apiError(400, 'Admin not created');
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(finduser);

    await prisma.user.update({
      where: {
        armyNo,
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
          'User singup in successfully'
        )
      );
  } catch (error) {
    throw new apiError(401, error?.message || 'Something went wrong while creating doctor request');
  }
});

//for fetching doctor's profile

export const getDoctorProfile = asyncHandler(async (req, res) => {
  //armyNo:-armyNo of doctor;
  const { armyNo } = req.body;
  const user = await prisma.User.findFirst({
    where: {
      armyNo: armyNo,
      role: 'DOCTOR',
    },
    select: {
      armyNo: true,
      firstName: true,
    },
  });
  const doctor = await prisma.Doctor.findFirst({
    where: {
      userId: user.id,
    },
    select: {
      specialization: true,
      status: true,
    },
  });
  if (!user) {
    throw new apiError(400, 'Doctor not found');
  }
  let ourDoctor = {
    armyNo: user.armyNo,
    firstName: user.firstName,
    specialization: doctor.specialization,
    status: doctor.status,
  };
  res.json(new ApiResponse(HttpStatusCode.OK, ourDoctor, "Doctor's Credentials:-"));
});

//Admin login
export const loginAdmin = asyncHandler(async (req, res) => {
  const { armyNo, password } = req.body;
  const adminId = armyNo;
  // check if all fields are filled
  if (!adminId) {
    throw new apiError(400, 'adminId  required');
  }
  if (!password) {
    throw new apiError(400, 'password  required');
  }

  // check if user exists
  const Admin = await prisma.admin.findFirst({
    where: {
      adminId,
    },
  });

  if (!Admin) {
    throw new apiError(404, 'User not found');
  }

  // check if password is correct
  const isCorrect = await bcrypt.compare(password, Admin.password);
  if (!isCorrect) {
    throw new apiError(401, 'Incorrect password');
  }
  const user = await prisma.user.findUnique({
    where: {
      id: Admin.userId,
    },
  });
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
export const getRequestsByStatus = asyncHandler(async (req, res) => {
  console.log('req.query', req.query);
  const { status } = req.query;
  try {
    console.log('step1');
    const requests = await prisma.request.findMany({
      where: {
        status: status,
      },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                firstName: true,
                middleName: true,
                lastName: true,
                dob: true,
                armyNo: true,
                unit: true,
              },
            },
          },
        },
      },
    });

    const formattedRequests = requests.map((request) => ({
      doctorId: request.doctor.id,
      fullName:
        `${request.doctor.user.firstName} ${request.doctor.user.middleName ?? ''} ${request.doctor.user.lastName ?? ''}`.trim(),

      armyNo: request.doctor.user.armyNo,
      unit: request.doctor.user.unit,
      dob: request.doctor.user.dob,
      status: request.status,
      specialization: request.doctor.specialization,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
    }));

    res.json(formattedRequests);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the requests.' });
  }
});

// fetch  doctor requests which is approved(Accepted)

export const approvedRequests = asyncHandler(async (req, res) => {
  try {
    const requests = await prisma.Request.findMany({
      where: {
        status: 'APPROVED',
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

    const formattedRequests = requests.map((request) => ({
      doctorId: request.doctor.id,
      fullName:
        `${request.doctor.user.firstName} ${request.doctor.user.middleName ?? ''} ${request.doctor.user.lastName ?? ''}`.trim(),

      armyNo: request.doctor.user.armyNo,
      unit: request.doctor.user.unit,
      status: request.status,
      specialization: request.doctor.specialization,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
    }));

    res.json(formattedRequests);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the requests.' });
  }
});

// approve request

export const approveRequest = asyncHandler(async (req, res) => {
  console.log('req from approve', req.query);
  const { doctorId } = req.query;

  const request = await prisma.request.findUnique({ where: { doctorId } });

  if (!request) {
    throw new apiError(404, 'Request not found');
  }

  const updatedRequest = await prisma.doctor.update({
    where: { id: doctorId },
    data: { status: 'APPROVED' },
  });
  await prisma.request.update({
    where: { doctorId },
    data: { status: 'APPROVED' },
  });
  console.log(updatedRequest);
  res.status(200).json({ updatedRequest });
});

// reject request
export const rejectRequest = asyncHandler(async (req, res) => {
  const { doctorId } = req.query;
  console.log('doctorId', doctorId);
  const request = await prisma.request.findUnique({ where: { doctorId } });

  if (!request) {
    throw new apiError(404, 'Request not found');
  }
  const updatedRequest = await prisma.doctor.update({
    where: { id: doctorId },
    data: { status: 'REJECTED' },
  });
  await prisma.request.update({
    where: { doctorId },
    data: { status: 'REJECTED' },
  });
  // clear the request after rejection
  await prisma.request.delete({ where: { doctorId } });
  res.status(200).json({ updatedRequest });
});

// remove/block accepted doctor
export const blockAcceptedDoctor = asyncHandler(async (req, res) => {
  const { doctorId } = req.query;
  const request = await prisma.request.findUnique({ where: { doctorId } });
  if (!request) {
    throw new apiError(404, 'Request not found');
  }
  const updatedRequest = await prisma.doctor.update({
    where: { id: doctorId },
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
    .json(new ApiResponse(200, req.user.firstName, 'User fetched successfully'));
});
