import express from 'express';
import {
 profilepatient,loginpatient
  
} from '../controllers/patientcontroller.js'; // Updated import path

const router = express.Router();
router.post('/patientprofile',profilepatient);
router.get('/loginpatient',loginpatient);
export default router;
