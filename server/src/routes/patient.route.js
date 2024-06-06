import express from 'express';
import { authorizePatientOrDoctor, verifyJwt } from '../middlewares/auth.middlewares.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  profilepatient,
  loginpatient,
  logoutPatient,
  getpersonalinfo,
  getHealthRecord,
  getFamilyHistory,
  getPersonalMedicalHistory,
  getAmeReports,
  getAme1Reports,
  getPmeReports,
  getUpdatedDates,
  getUpdatedDatesAME,
  getUpdatedDatesAME1,
  getUpdatedDatesPME,
} from '../controllers/patient.controller.js'; // Updated import path

const router = express.Router();
router.post('/create-patient-profile', profilepatient);
router.post('/login', loginpatient);
router.post('/logout', verifyJwt, authorizePatientOrDoctor, logoutPatient);

router.get('/personal-info', verifyJwt, authorizePatientOrDoctor, getpersonalinfo);
router.post('/get-dates', verifyJwt, authorizePatientOrDoctor, asyncHandler(getUpdatedDates));
router.post(
  '/get-dates-ame',
  verifyJwt,
  authorizePatientOrDoctor,
  asyncHandler(getUpdatedDatesAME)
);
router.post(
  '/get-dates-ame1',
  verifyJwt,
  authorizePatientOrDoctor,
  asyncHandler(getUpdatedDatesAME1)
);
router.post(
  '/get-dates-pme',
  verifyJwt,
  authorizePatientOrDoctor,
  asyncHandler(getUpdatedDatesPME)
);
router.get('/healthRecord', verifyJwt, authorizePatientOrDoctor, getHealthRecord);
router.get('/familyHistory', verifyJwt, authorizePatientOrDoctor, getFamilyHistory);
router.get('/personalhistory', verifyJwt, authorizePatientOrDoctor, getPersonalMedicalHistory);
router.get('/ametestreports', verifyJwt, authorizePatientOrDoctor, getAmeReports);
router.get('/ame1testreports', verifyJwt, authorizePatientOrDoctor, getAme1Reports);
router.get('/pmetestreports', verifyJwt, authorizePatientOrDoctor, getPmeReports);
export default router;
