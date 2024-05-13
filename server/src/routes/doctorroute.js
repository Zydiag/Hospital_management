import express from 'express';
import {
  getPersonalInfo,
  updatePersonalInfo,
  getHealthRecord,
  updateHealthRecord,
  getPersonalMedicalHistory,
  updatePersonalMedicalHistory,
  getFamilyHistory,
  updateFamilyHistory,
  getPresentReferralDetails,
  updatePresentReferralDetails,
  //deletePresentReferralDetails,
} from '../controllers/doctorcontroller.js'; // Updated import path

const router = express.Router();

// In doctorroute.js
router.get('/test', (req, res) => {
  res.send('Test endpoint working');
});

router.post('/personal-info', (req, res, next) => {
  console.log('Inside POST /personal-info route');
  getPersonalInfo(req, res, next);
});//checked

router.put('/personal-info', updatePersonalInfo);//checked
router.get('/health-record', getHealthRecord);//checked
router.post('/health-record', updateHealthRecord);//checked
router.get('/personal-medical-history', getPersonalMedicalHistory);//checked
router.post('/personal-medical-history', updatePersonalMedicalHistory);//checked
router.get('/family-history', getFamilyHistory);
router.post('/family-history', updateFamilyHistory);
router.get('/present-referral-details', getPresentReferralDetails);
router.post('/present-referral-details', updatePresentReferralDetails);
//router.delete('/present-referral-details', deletePresentReferralDetails);

export default router;
