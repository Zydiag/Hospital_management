import express from 'express';
import { verifyJwt } from '../middlewares/auth.middlewares.js';
//import { authorizeAdmin } from '../middlewares/authmiddlewares.js';
import { authorizeDoctor } from '../middlewares/auth.middlewares.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  getPersonalInfo,
  updatePersonalInfo,
  getHealthRecord,
  updateHealthRecord,
  getTreatmentRecord,
  updateTreatmentRecord,
  getFamilyHistory,
  updateFamilyHistory,
  createDoctorProfile,
  addTestReport,
  getAllTestReports,
  updateAME1,
  updateAME2,
  updatePME,
  //deletePresentReferralDetails,
} from '../controllers/doctor.controller.js'; // Updated import path

const router = express.Router();

// In doctorroute.js
router.get('/test', (req, res) => {
  res.send('Test endpoint working');
});

router.get('/personal-info', asyncHandler(getPersonalInfo));
router.get('/health-record', asyncHandler(getHealthRecord));
router.get('/treatment-record', asyncHandler(getTreatmentRecord));
router.get('/family-history', asyncHandler(getFamilyHistory));
router.get('/testreports', asyncHandler(getAllTestReports));


router.post('/doctor-profile',asyncHandler( createDoctorProfile));
router.post('/personal-info',verifyJwt,authorizeDoctor,asyncHandler(updatePersonalInfo));
router.post('/health-record', verifyJwt, authorizeDoctor, asyncHandler(updateHealthRecord)); //checked
router.post('/treatment-record', verifyJwt, authorizeDoctor, asyncHandler(updateTreatmentRecord)); //checked
router.post('/family-history', verifyJwt, authorizeDoctor, asyncHandler(updateFamilyHistory));
router.post('/testreport', verifyJwt, authorizeDoctor, asyncHandler(addTestReport));
router.post('/updateAME1', verifyJwt, authorizeDoctor, asyncHandler(updateAME1));
router.post('/updateAME2', verifyJwt, authorizeDoctor, asyncHandler(updateAME2));
router.post('/updatePME', verifyJwt, authorizeDoctor, asyncHandler(updatePME));
//router.delete('/present-referral-details', deletePresentReferralDetails);

export default router;
