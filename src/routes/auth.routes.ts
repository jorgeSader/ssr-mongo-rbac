import express from "express";
import { User } from "../models/user.model.js";
import { body, validationResult } from "express-validator";
import passport from "passport";

const router = express.Router();

// Login page
router.get('/login', async (req, res, next) => {
  res.render('login');
});

// Local Passport Login
router.post('/login', passport.authenticate('local', {
  successRedirect: "/user/profile/",
  failureRedirect: "/auth/login/",
  failureFlash: true
})
);

// Google Passport Login
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Google Passport Redirect
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.send("You have reached Google's callback URI");
  // res.redirect('/user/profile');
});


// Register
router.get('/register', async (req, res, next) => {
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
  async (req, res, next) => {
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
        res.redirect('/auth/register');
        return;
      }

      const user = new User(req.body);
      await user.save();

      req.flash('success', `${user.email} Registered successfully. You can now log in.`);

      res.redirect('/auth/login');
    } catch (error) {
      next(error);
    }

  });

// Logout
router.get('/logout', async (req, res, next) => {
  res.redirect('/');
});



export default router; 