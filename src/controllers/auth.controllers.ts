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
      res.render('register', { email: req.body.email.trim(), password: req.body.password.trim(), accountId: req.body.accountId.trim(), messages: req.flash() });
      return;
    }

    const { email, accountId } = req.body;
    console.log("🚀 ~ file: auth.controllers.ts:41 ~ postAuthRegister ~ accountId:", accountId);

    // Look for existing user
    const existingUser = await User.findOne({ email }).populate('account');

    // Return error if it exists
    if (existingUser) {
      req.flash('info', `${existingUser.email} is already registered. Please log in.`);
      res.redirect('/auth/login');
      return;
    }

    // Create new user.
    const user = new User(req.body);

    // Check if an accountId was provided.
    if (accountId && accountId.length > 0) {
      // Check that it is a valid Mongo IDaccountId
      const isValidMongoId = mongoose.Types.ObjectId.isValid(accountId);
      console.log("🚀 ~ file: auth.controllers.ts:59 ~ postAuthRegister ~ isValidMongoId:", isValidMongoId);
      if (!isValidMongoId) {
        req.flash('error', `Invalid Account ID / Invite Code.`);
        return res.redirect('back');
      }
      // Look for existing account
      const existingAccount = await Account.findById(accountId);
      console.log("🚀 ~ file: auth.controllers.ts:66 ~ postAuthRegister ~ existingAccount:", existingAccount);
      if (!existingAccount) {
        req.flash('error', `Invalid Account ID / Invite Code.`);
        return res.redirect('back');
      }
      // Assign accountId to new user
      user.account = accountId;
    }

    // Save the user to the DB and redirect to login.
    const newUser = await user.save();
    console.log("🚀 ~ file: auth.controllers.ts:77 ~ postAuthRegister ~ newUser:", newUser);
    req.flash('success', `${newUser.email} Registered successfully. You can now log in.`);
    res.locals.email = newUser.email;
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

