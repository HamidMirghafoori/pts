const express = require('express');
const router = express.Router(); 
const {signup, signin, logout, singleUser, userProfile } = require("../controllers/auth-controller");

import { isAuthenticated } from "../middlewares/auth-middleware";

router.get('/', isAuthenticated, userProfile);
router.post('/signup', signup );
router.post('/signin', signin );
router.get('/logout', logout );
// router.get('/getme', isAuthenticated,  userProfile );
// router.get('/user/:id', singleUser );

module.exports = router;