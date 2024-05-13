import express from 'express';
import {
  getPersonalInfo,
  updatePersonalInfo,
  getHealthRecord,
  updateHealthRecord,
  getTreatmentRecord,
  updateTreatmentRecord,
  getFamilyHistory,
  updateFamilyHistory,
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
router.get('/treatment-record', getTreatmentRecord);//checked
router.post('/treatment-record', updateTreatmentRecord);//checked
router.get('/family-history', getFamilyHistory);
router.post('/family-history', updateFamilyHistory);
//router.delete('/present-referral-details', deletePresentReferralDetails);

export default router;
