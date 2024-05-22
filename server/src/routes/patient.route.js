import express from 'express';
import {
 profilepatient,loginpatient,getpersonalinfo,getHealthRecord,getFamilyHistory,getPersonalMedicalHistory
  
} from '../controllers/patientcontroller.js'; // Updated import path

const router = express.Router();
router.post('/patientprofile',profilepatient);
router.get('/loginpatient',loginpatient);
router.get('/personal-info',getpersonalinfo);
router.get('/healthRecord',getHealthRecord);
router.get('/familyHistory',getFamilyHistory);
router.get('/personalhistory',getPersonalMedicalHistory)
export default router;
