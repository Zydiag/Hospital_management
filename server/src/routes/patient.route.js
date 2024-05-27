import express from 'express';
import { verifyJwt } from '../middlewares/auth.middlewares.js';
import { authorizeAdmin } from '../middlewares/auth.middlewares.js';
import { authorizeDoctor } from '../middlewares/auth.middlewares.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  profilepatient,
  loginpatient,
  getpersonalinfo,
  getHealthRecord,
  getFamilyHistory,
  getPersonalMedicalHistory,
  getAmeReports,getAme1Reports,getPmeReports,
} from '../controllers/patient.controller.js'; // Updated import path

const router = express.Router();
router.post('/patientprofile', profilepatient);
router.get('/loginpatient', loginpatient);
router.get('/personal-info', getpersonalinfo);
router.get('/healthRecord', getHealthRecord);
router.get('/familyHistory', getFamilyHistory);
router.get('/personalhistory', getPersonalMedicalHistory);
router.get('/ametestreports', getAmeReports);
router.get('/ame1testreports', getAme1Reports);
router.get('/pmetestreports',getPmeReports);
export default router;
