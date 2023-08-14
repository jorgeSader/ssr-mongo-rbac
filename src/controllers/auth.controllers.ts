import { validationResult } from "express-validator";

import { User } from "../models/user.model.js";


// GET auth/login - Render login page
export const getAuthLogin = async (req: any, res: any, next: any) => {
  res.render('login');
};

// GET auth/register - Render register page
export const getAuthRegister = async (req: any, res: any, next: any) => {
  // req.flash('error', 'some error ocurred'); // test flash message
  // req.flash('error', 'another error ocurred'); // test flash message
  // req.flash('warning', 'some warning here'); // test flash message
  // req.flash('success', 'some success message here'); // test flash message
  // req.flash('info', 'some info message here'); // test flash message

  // const messages = req.flash(); // test flash message on this page
  // res.render('register', {messages}); // test flash message on this page

  // res.redirect('/auth/login'); // test flash message on redirect
  res.render('register'); // comment out for testing
};

// POST auth/register - register User
export const postAuthRegister = async (req: any, res: any, next: any) => {
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
    req.flash('success', `${user.email} Registered successfully. You can now log in.`);

    res.redirect('/auth/login');
  } catch (error) {
    next(error);
  }
};

// USE auth/logout - logout User
export const useAuthLogout = async function (req: any, res: any, next: any) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
};

