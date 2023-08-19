import express from "express";
import passport from "passport";
import { ensureLoggedIn, ensureLoggedOut } from 'connect-ensure-login';
import { getAuthLogin, getAuthRegister, postAuthRegister, useAuthLogout } from "../controllers/auth.controllers.js";
import { registerValidator } from "../utils/validators.js";

const router = express.Router();

// Login page
router.get('/login', ensureLoggedOut({ redirectTo: '/profile' }), getAuthLogin);

//==================// Local Passport Strategy //==================//

// Local Passport Login
router.post('/login', passport.authenticate('local', {
  // successRedirect: "/user/profile/",
  successReturnToOrRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true
})
);

//==================// Google Passport Strategy //==================//

// Google Passport Login
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Google Passport Redirect
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('/');
});

//==================// Instagram Passport Strategy //==================//

//TODO: Add passport login strategy for Instagram


//==================// GitHub Passport Strategy //==================//

//TODO: Add passport login strategy for GitHub


//===================================================================//



// Register Page
router.get('/register', ensureLoggedOut({ redirectTo: '/profile' }), getAuthRegister);

// Registration request
router.post('/register', registerValidator, postAuthRegister);

// Logout
router.use('/logout', ensureLoggedIn({ redirectTo: '/profile' }), useAuthLogout);


export default router; 