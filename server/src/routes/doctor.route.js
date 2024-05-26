import express from 'express';
import { verifyjwt } from '../middlewares/authmiddlewares.js';
import { authorizeAdmin } from '../middlewares/authmiddlewares.js';
import { authorizeDoctor } from '../middlewares/authmiddlewares.js';
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
  CreateDoctorProfile,
  addTestReport,
  getAllTestReports,updateAME1,
  updateAME2,
  updatePME
  //deletePresentReferralDetails,
} from '../controllers/doctorcontroller.js'; // Updated import path

const router = express.Router();

// In doctorroute.js
router.get('/test', (req, res) => {
  res.send('Test endpoint working');
});

router.post('/personal-info', asyncHandler(getPersonalInfo));
router.get('/health-record', asyncHandler(getHealthRecord));
router.get('/treatment-record', asyncHandler(getTreatmentRecord));
router.get('/family-history', asyncHandler(getFamilyHistory));
router.get('/testreports', asyncHandler(getAllTestReports));

//router.post('/doctor-profile',verifyjwt,authorizeAdmin,asyncHandler(CreateDoctorProfile));
router.post('/health-record',verifyjwt,authorizeDoctor,asyncHandler(updateHealthRecord));//checked
router.post('/treatment-record',verifyjwt,authorizeDoctor,asyncHandler(updateTreatmentRecord));//checked
router.post('/family-history',verifyjwt,authorizeDoctor,asyncHandler(updateFamilyHistory));
router.post('/testreport',verifyjwt,authorizeDoctor,asyncHandler(addTestReport));
router.post('/updateAME1',verifyjwt,authorizeDoctor,asyncHandler(updateAME1));
router.post('/updateAME2',verifyjwt,authorizeDoctor,asyncHandler(updateAME2));
router.post('/updatePME', verifyjwt,authorizeDoctor,asyncHandler(updatePME));
//router.delete('/present-referral-details', deletePresentReferralDetails);

export default router;
