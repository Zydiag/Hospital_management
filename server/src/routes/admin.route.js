import express from 'express';
import {getDoctorProfile} from '../controllers/admin.controller.js';
const router = express.Router();
router.get('/getdoctorprofile',getDoctorProfile);
//router.route('/login').post(loginAdmin);
export default router;

