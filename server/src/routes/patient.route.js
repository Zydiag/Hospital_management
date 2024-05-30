import express from 'express';
import { verifyJwt } from '../middlewares/auth.middlewares.js';
import { authorizePatient } from '../middlewares/auth.middlewares.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  profilepatient,
  loginpatient,
  logoutPatient,
  getpersonalinfo,
  getHealthRecord,
  getFamilyHistory,
  getPersonalMedicalHistory,
  getAmeReports,getAme1Reports,getPmeReports,
} from '../controllers/patient.controller.js'; // Updated import path

const router = express.Router();
router.post('/patientprofile', profilepatient);
router.post('/patient-login', loginpatient);
router.post('/patient-logout',verifyJwt,authorizePatient, logoutPatient);
router.get('/personal-info',verifyJwt,authorizePatient, getpersonalinfo);
router.get('/healthRecord',verifyJwt,authorizePatient, getHealthRecord);
router.get('/familyHistory',verifyJwt, authorizePatient,getFamilyHistory);
router.get('/personalhistory',verifyJwt,authorizePatient, getPersonalMedicalHistory);
router.get('/ametestreports',verifyJwt, authorizePatient,getAmeReports);
router.get('/ame1testreports',verifyJwt,authorizePatient, getAme1Reports);
router.get('/pmetestreports',verifyJwt,authorizePatient,getPmeReports);
export default router;
