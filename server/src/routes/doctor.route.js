import { Router } from 'express';
import { verifyjwt } from '../middlewares/authmiddlewares.js';
import { authorizeAdmin } from '../middlewares/authmiddlewares.js';
import { authorizeDoctor } from '../middlewares/authmiddlewares.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  createDoctorProfile,
  getPersonalInfo,
  updatePersonalInfo,
  getHealthRecord,
  updateHealthRecord,
  getTreatmentRecord,
  updateTreatmentRecord,
  getFamilyHistory,
  updateFamilyHistory
} from '../controllers/yourController.js';
//import { errorHandler } from '../middlewares/errorHandler.js';

const router = Router();

// Unprotected routes
router.post('/get-personal-info', asyncHandler(getPersonalInfo));
router.post('/get-health-record', asyncHandler(getHealthRecord));
router.post('/get-treatment-record', asyncHandler(getTreatmentRecord));
router.post('/get-family-history', asyncHandler(getFamilyHistory));
router.post('/get-all-test-reports', asyncHandler(getAllTestReports));

// Protected routes
router.post('/create-doctor-profile', verifyjwt, authorizeAdmin, asyncHandler(createDoctorProfile));
router.post('/update-personal-info', verifyjwt, authorizeDoctor, asyncHandler(updatePersonalInfo));
router.post('/update-health-record', verifyjwt, authorizeDoctor, asyncHandler(updateHealthRecord));
router.post('/update-treatment-record', verifyjwt, authorizeDoctor, asyncHandler(updateTreatmentRecord));
router.post('/update-family-history', verifyjwt, authorizeDoctor, asyncHandler(updateFamilyHistory));
router.post('/add-test-report', verifyjwt, authorizeDoctor, asyncHandler(addTestReport));

// Error handling middleware
//router.use(errorHandler);

export default router;
