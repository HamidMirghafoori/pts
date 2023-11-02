const express = require('express');
const router = express.Router(); 
const {signup, signin, logout, userProfile } = require("../controllers/auth-controller");

const { isRootAuthenticated } = require("../middlewares/auth-middleware");

router.post('/', isRootAuthenticated, userProfile);
router.post('/signup', signup );
router.post('/signin', signin );
router.get('/logout', logout );

module.exports = router;