import express from 'express';
import { verifyJwt } from '../middlewares/auth.middlewares.js';
import { authorizeAdmin } from '../middlewares/auth.middlewares.js';
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
  getAmeReports,
  getAme1Reports,
  getPmeReports,
  updateAME1,
  updateAME2,
  updatePME,
  loginDoctor,
  logoutDoctor,
  createPatientProfile,
  //deletePresentReferralDetails,
} from '../controllers/doctor.controller.js'; // Updated import path

const router = express.Router();

// In doctorroute.js
router.get('/test', (req, res) => {
  res.send('Test endpoint working');
});

router.post('/create-doctor-profile', asyncHandler(createDoctorProfile));
router.post('/login', asyncHandler(loginDoctor));

router.post(
  '/create-patient-profile',
  verifyJwt,
  authorizeDoctor,
  asyncHandler(createPatientProfile)
);
router.post('/logout', verifyJwt, authorizeDoctor, asyncHandler(logoutDoctor));
router.get('/personal-info', verifyJwt, authorizeDoctor, asyncHandler(getPersonalInfo));

router.get('/health-record', verifyJwt, authorizeDoctor, asyncHandler(getHealthRecord));
router.get('/treatment-record', verifyJwt, authorizeDoctor, asyncHandler(getTreatmentRecord));
router.get('/family-history', verifyJwt, authorizeDoctor, asyncHandler(getFamilyHistory));
router.get('/ametestreports', verifyJwt, authorizeDoctor, asyncHandler(getAmeReports));
router.get('/ame1testreports', verifyJwt, authorizeDoctor, asyncHandler(getAme1Reports));
router.get('/pmetestreports', verifyJwt, authorizeDoctor, asyncHandler(getPmeReports));

router.post('/update-personal-info', verifyJwt, authorizeDoctor, asyncHandler(updatePersonalInfo));
router.post('/update-health-record', verifyJwt, authorizeDoctor, asyncHandler(updateHealthRecord)); //checked
router.post(
  '/update-treatment-record',
  verifyJwt,
  authorizeDoctor,
  asyncHandler(updateTreatmentRecord)
); //checked
router.post(
  '/update-family-history',
  verifyJwt,
  authorizeDoctor,
  asyncHandler(updateFamilyHistory)
);
router.post('/update-testreport', verifyJwt, authorizeDoctor, asyncHandler(addTestReport));
router.post('/update-AME1', verifyJwt, authorizeDoctor, asyncHandler(updateAME1));
router.post('/update-AME2', verifyJwt, authorizeDoctor, asyncHandler(updateAME2));
router.post('/update-PME', verifyJwt, authorizeDoctor, asyncHandler(updatePME));
//router.delete('/present-referral-details', deletePresentReferralDetails);

export default router;
