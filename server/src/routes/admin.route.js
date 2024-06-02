import { Router } from 'express';
import { verifyJwt, authorizeAdmin } from '../middlewares/auth.middlewares.js';
import {
  createAdmin,
  loginAdmin,
  logoutAdmin,
  rejectRequest,
  approveRequest,
  getCurrentUser,
  getRequestsByStatus,
  blockAcceptedDoctor,
} from '../controllers/admin.controller.js';

const router = Router();

router.route('/login').post(loginAdmin);
router.route('/create-admin-profile').post(createAdmin);
router.route('/logout').post(verifyJwt, authorizeAdmin, logoutAdmin);
router.route('/user-profile').post(verifyJwt, authorizeAdmin, getCurrentUser);

// all requests by status
router.route('/all-doctor-requests').get(verifyJwt, authorizeAdmin, getRequestsByStatus);

router.route('/reject-request').post(verifyJwt, authorizeAdmin, rejectRequest);
router.route('/approve-request').post(verifyJwt, authorizeAdmin, approveRequest);
router.route('/block-request').post(verifyJwt, authorizeAdmin, blockAcceptedDoctor);
export default router;
