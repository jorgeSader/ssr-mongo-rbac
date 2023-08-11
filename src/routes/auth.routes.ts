import express from "express";
import { User } from "../models/user.model.js";
import { body, validationResult } from "express-validator";
import passport from "passport";
import { ensureLoggedIn, ensureLoggedOut } from 'connect-ensure-login';

const router = express.Router();

// Login page
router.get('/login', ensureLoggedOut({ redirectTo: '/user/profile' }), async (req, res, next) => {
  res.render('login');
});

// Local Passport Login
router.post('/login', passport.authenticate('local', {
  // successRedirect: "/user/profile/",
  successReturnToOrRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true
})
);

// Google Passport Login
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Google Passport Redirect
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  // res.send(req.user);
  res.redirect('/');
});

// Register
router.get('/register', ensureLoggedOut({ redirectTo: '/user/profile' }), async (req, res, next) => {
  // req.flash('error', 'some error ocurred'); // test flash message
  // req.flash('error', 'another error ocurred'); // test flash message
  // req.flash('warning', 'some warning here'); // test flash message
  // req.flash('success', 'some success message here'); // test flash message
  // req.flash('info', 'some info message here'); // test flash message

  // const messages = req.flash(); // test flash message on this page
  // res.render('register', {messages}); // test flash message on this page

  // res.redirect('/auth/login'); // test flash message on redirect

  res.render('register'); // comment out for testing
});

router.post('/register', [
  body('email').trim().isEmail().withMessage('Please enter a valid email.').toLowerCase(),
  body('password').trim().isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  }).withMessage('Please enter a strong password. It should be at least 8 character long and contain at least 1 lowercase, 1 uppercase, 1 number, and 1 symbol.')
],
  async (req: any, res: any, next: any) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors.array().forEach(error => {
          req.flash('error', error.msg);
        });
        res.render('register', { email: req.body.email, password: req.body.password, messages: req.flash() });
      }

      const { email } = req.body;
      const doesExist = await User.findOne({ email });

      if (doesExist) {
        req.flash('info', `${doesExist.email} is already registered. Please log in.`);
        res.redirect('/auth/login');
        return;
      }

      const user = new User(req.body);
      const newUser = await user.save();
      console.log("🚀 ~ file: auth.routes.ts:81 ~ newUser:", newUser);

      req.flash('success', `${user.email} Registered successfully. You can now log in.`);

      res.redirect('/auth/login');
    } catch (error) {
      next(error);
    }

  });

// Logout
router.use('/logout', ensureLoggedIn({ redirectTo: '/user/profile' }), function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});


export default router; 