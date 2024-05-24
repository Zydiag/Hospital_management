import { apiError } from '../utils/apiError';
import { apiResponse } from '../utils/apiResponse';
import { asynchandler } from '../utils/asyncHandler';
import jwt from 'jsonwebtoken';

//
const generateAccessAndRefreshToken = async (Admin) => {
  try {
    const accessToken = jwt.sign({ id: Admin.id }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign({ id: Admin.id }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '8h',
    });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log('error: ', error);
    throw new apiError(500, 'Something went wrong while generating access and refresh token');
  }
};
//for fetching doctor's profile
export const getDoctorProfile=asyncHandler(async(req,res)=>{
  //armyNo:-armyNo of doctor;
  const {armyNo}=req.body;
  const user =await prisma.User.findFirst({
    where:{
      armyNo:armyNo,
      role:"DOCTOR",
    },
    select:{
      armyNo:true,
      firstName:true,
    }
  })
  const doctor=await prisma.Doctor.findFirst({
    where:{
      userId:user.id,
    },
    select:{
      specialization:true,
      status:true
    }

  })
  if(!user){
    throw new apiError(400, 'Doctor not found');
  }
  res.json(new ApiResponse(HttpStatusCode.OK, {user.armyNo,user.firstName,doctor.specialization,doctor.status},"Doctor's Credentials:-"));
})
//Admin login
export const loginAdmin = asynchandler(async (req, res) => {
  const { id, password } = req.body;
  // check if all fields are filled
  if (!id) {
    throw new apiError(400, 'id  required');
  }
  if (!password) {
    throw new apiError(400, 'password  required');
  }
  // check if user exists
  const Admin = await prisma.admin.findUnique({
    where: {
      id: id,
    },
  });
  if (!Admin) {
    throw new apiError(404, 'User not found');
  }
  // check if password is correct
  if (Admin.password !== password) {
    throw new apiError(401, 'Incorrect password');
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(Admin);
  await prisma.admin.update({
    where: {
      id,
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
      new apiResponse(
        200,
        {
          accessToken,
          refreshToken,
        },
        'User logged in successfully'
      )
    );
});

// fetch all doctor requests
export const doctorRequests = async (req, res) => {
  const requests = await prisma.request.findMany();
  res.json(requests);
}

// approve request
export const approveRequest = async (req, res) => {
  const { doctorId} = req.body;
  const request = await prisma.request.findUnique({ where: { doctorId } });
  if (!request) {
    throw new apiError(404, 'Request not found');
  }
  const updatedRequest = await prisma.doctor.update({
    where: { doctorId },
    data: { status: 'APPROVED' },
  });
  res.json(updatedRequest);
}
// reject request
export const rejectRequest = async (req, res) => {
  const { doctorId} = req.body;
  const request = await prisma.request.findUnique({ where: { doctorId } });
  if (!request) {
    throw new apiError(404, 'Request not found');
  }
  const updatedRequest = await prisma.doctor.update({
    where: { doctorId },
    data: { status: 'REJECTED' },
  });
  res.json(updatedRequest);
}

// Admin Logout
export const logoutAdmin = asynchandler(async (req, res) => {
  await prisma.user.update({
    where: {
      id: req.user.id
    },
    data: {
      refreshToken: null
    }
  })
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(new apiResponse(200, {}, "Admin logout successfully"));
});

// export const logoutAdmin = async (req, res) => {
//   res.clearCookie('refreshToken');
//   res.clearCookie('accessToken');
//   res.json(new apiResponse(200, null, 'User logged out successfully'));
