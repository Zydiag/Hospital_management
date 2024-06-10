import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authorizePatientOrDoctor, verifyJwt } from '../middlewares/auth.middlewares.js';
import {
  getAme1Reports,
  getAmeReports,
  getCombinedUpdatedDates,
  getFamilyHistory,
  getHealthRecord,
  getPersonalInfo,
  getPmeReports,
  getTreatmentRecord,
  getUpdatedDates,
  getUpdatedDatesAME,
  getUpdatedDatesAME1,
  getUpdatedDatesPME,
} from '../controllers/doctor.controller.js';
import { getCurrentUser, refreshAccessToken } from './refresh.route.js';

const router = Router();
router.route('/current-user-profile').get(verifyJwt, getCurrentUser);
router.route('/refresh-access-token').post(refreshAccessToken);

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

router.post(
  '/get-combined-dates',
  verifyJwt,
  authorizePatientOrDoctor,
  asyncHandler(getCombinedUpdatedDates)
);
router.get('/personal-info', verifyJwt, authorizePatientOrDoctor, asyncHandler(getPersonalInfo));

router.post('/health-record', verifyJwt, authorizePatientOrDoctor, asyncHandler(getHealthRecord));
router.post(
  '/treatment-record',
  verifyJwt,
  authorizePatientOrDoctor,
  asyncHandler(getTreatmentRecord)
);
router.post('/family-history', verifyJwt, authorizePatientOrDoctor, asyncHandler(getFamilyHistory));

router.post('/ametestreports', verifyJwt, authorizePatientOrDoctor, asyncHandler(getAmeReports));
router.post('/ame1testreports', verifyJwt, authorizePatientOrDoctor, asyncHandler(getAme1Reports));
router.post('/pmetestreports', verifyJwt, authorizePatientOrDoctor, asyncHandler(getPmeReports));

// router.get('/personalhistory', verifyJwt, authorizePatientOrDoctor, getPersonalMedicalHistory);

export default router;
