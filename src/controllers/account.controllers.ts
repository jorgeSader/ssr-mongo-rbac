import mongoose, { Types } from "mongoose";
import Account from "../models/account.model.js";
import { RequestHandler } from "express";

// GET /account - 
export const getAccountList: RequestHandler = async (req, res, next) => {
  try {
    return Account.find();

  } catch (error) {
    next(error);
  }
};

export const getAccountById: RequestHandler = async (req, res, next) => {
  try {
    const accountId = req.params.accountId;
    const isValidMongoID = mongoose.Types.ObjectId.isValid(accountId);

    if (!isValidMongoID) {
      req.flash('error', 'Invalid ID!');
      res.redirect('back');
    }
    const account = await Account.find({ id: accountId });
    if (!account) {
      req.flash('error', 'Account not Found!');
      res.redirect('back');
    }
    res.send(account); // TODO: create account view and uncomment line below.
    // res.render('account', { account });
  } catch (error) {
    next(error);
  }
};

export const getCurrentAccount: RequestHandler = async (req, res, next) => {
  try {
    const accountId = req.user.account.id;
    const account = await Account.findById(accountId);
    if (!account) {
      req.flash('error', 'Invalid ID!');
      res.status(404);
    }
    res.status(200).send(account); // TODO: 

  } catch (error) {
    next(error);
  }

};