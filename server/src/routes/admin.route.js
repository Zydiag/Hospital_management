import { Router } from 'express';
import { verifyJwt ,authorizeAdmin} from '../middlewares/auth.middlewares.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  createAdmin,
  loginAdmin,
  logoutAdmin,
  rejectRequest,
  approveRequest,
  approvedRequests,
  pendingRequests,
  getCurrentUser
} from '../controllers/admin.controller.js';

const router = Router();

router.route('/login').post(loginAdmin);
router.route('/create-admin-profile').post(createAdmin);
router.route('/logout').post(verifyJwt, authorizeAdmin,logoutAdmin);
router.route('/user-profile').post(verifyJwt,authorizeAdmin, getCurrentUser);
router.route('/all-pending-doctor-requests').get(verifyJwt,authorizeAdmin, pendingRequests);
router.route('/all-approved-doctor-requests').get(verifyJwt, authorizeAdmin,approvedRequests);
router.route('/reject-request').post(verifyJwt,authorizeAdmin, rejectRequest);
router.route('/approve-request').post(verifyJwt, authorizeAdmin,approveRequest);
export default router;
