import { Router } from 'express';
import { verifyJwt } from '../middlewares/auth.middlewares.js';
import { authorizeAdmin } from '../middlewares/auth.middlewares.js';
import { authorizeDoctor } from '../middlewares/auth.middlewares.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  createDoctorProfile,
  loginDoctor,
  logoutDoctor,
  getPersonalInfo,
  updatePersonalInfo,
  getHealthRecord,
  updateHealthRecord,
  getTreatmentRecord,
  updateTreatmentRecord,
  getFamilyHistory,
  updateFamilyHistory,
} from '../controllers/doctor.controller.js';

const router = Router();

// Unprotected routes
router.post('/get-personal-info', asyncHandler(getPersonalInfo));
router.post('/get-health-record', asyncHandler(getHealthRecord));
router.post('/get-treatment-record', asyncHandler(getTreatmentRecord));
router.post('/get-family-history', asyncHandler(getFamilyHistory));
router.post('/create-doctor-profile', asyncHandler(createDoctorProfile));
router.post('/doctor-login', asyncHandler(loginDoctor));
// Protected routes
// router.post('/create-doctor-profile', verifyJwt, authorizeAdmin, asyncvHandler(createDoctorProfile));
router.post('/doctor-logout', verifyJwt, authorizeDoctor, asyncHandler(logoutDoctor));
router.post('/update-personal-info', verifyJwt, authorizeDoctor, asyncHandler(updatePersonalInfo));
router.post('/update-health-record', verifyJwt, authorizeDoctor, asyncHandler(updateHealthRecord));
router.post('/update-treatment-record',verifyJwt,authorizeDoctor,asyncHandler(updateTreatmentRecord));
router.post('/update-family-history',verifyJwt,authorizeDoctor,asyncHandler(updateFamilyHistory));

// Error handling middleware
//router.use(errorHandler);

export default router;
