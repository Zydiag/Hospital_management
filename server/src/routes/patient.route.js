import express from 'express';
import {
 profilepatient,loginpatient,getpersonalinfo,getHealthRecord
  
} from '../controllers/patientcontroller.js'; // Updated import path

const router = express.Router();
router.post('/patientprofile',profilepatient);
router.get('/loginpatient',loginpatient);
router.get('/personal-info',getpersonalinfo);
router.get('/healthRecord',getHealthRecord);
export default router;
