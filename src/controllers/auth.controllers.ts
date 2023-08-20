import { validationResult } from "express-validator";

import Account from "../models/account.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";


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
      res.render('register', { email: req.body.email, password: req.body.password, accountId: req.body.accountId, messages: req.flash() });
    }

    const { email, accountId } = req.body;

    // Look for existing user
    const existingUser = await User.findOne({ email }).populate('account');

    // Return error if it exists
    if (existingUser) {
      req.flash('info', `${existingUser.email} is already registered. Please log in.`);
      res.redirect('/auth/login');
      return;
    }

    // Create new user if it doesn't.
    const user = new User(req.body);

    // If we got an Account ID, Verify that it is a valid mongoID and that the account exists.
    const isMongoId = mongoose.Types.ObjectId.isValid(accountId);
    const account = await Account.findById(accountId);

    // If the account exists add its ID to the newly created user.
    if (isMongoId && account) {
      user.account = accountId;
    }

    // Save the user to the DB and redirect to login.
    const newUser = await user.save();
    req.flash('success', `${newUser.email} Registered successfully. You can now log in.`);
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

