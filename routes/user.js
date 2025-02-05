const express=require('express');
const wrapAsync = require('../Utils/wrapAsync');
const passport = require('passport');
const router=express.Router();
// const User = require('../models/user.js');
const { saveRedirectUrl } = require("../middleware.js");

//User Controller For Listings
const userController=require('../controllers/users.js');

//Related Route Is User SignUp .
router.route('/signup')
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

//Related Route Is login Page.
router.route('/login')
.get(userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),userController.login)

//Logout Page 
router.get('/logout', userController.logout);
module.exports = router;