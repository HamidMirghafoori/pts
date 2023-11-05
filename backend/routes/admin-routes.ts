import express from 'express';
import { applications, updateApplications } from '../controllers/admin-controller';

const router = express.Router(); 
const { isAuthenticated, isAdminOrOfficer} = require("../middlewares/auth-middleware");

router.post('/applications', isAuthenticated, isAdminOrOfficer, applications );
router.post('/update-application', isAuthenticated, isAdminOrOfficer, updateApplications );

module.exports = router;