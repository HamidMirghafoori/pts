import express from 'express';
import { applications, updateApplications } from '../controllers/admin-controller';

const router = express.Router(); 
const { isAuthenticated, isAdmin } = require("../middlewares/auth-middleware");

router.post('/applications', isAuthenticated, isAdmin, applications );
router.post('/update-application', isAuthenticated, isAdmin, updateApplications );

module.exports = router;