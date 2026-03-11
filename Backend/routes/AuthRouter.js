const router = require('express').Router();
const {signupValidation,loginValidation} = require('../middleware/AuthValidation');
const {Signup,Login} = require('../controllers/AuthController');

router.post('/login',loginValidation,Login);

router.post('/signup',signupValidation,Signup);

module.exports = router;