import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/user.model.js";
import mongoose from "mongoose";
import { roles } from "../utils/constants.js";

export const getUserList = async (req: Request, res: Response, next: NextFunction) => {
  const currentUser = req.user;
  if (!currentUser) {
    req.flash('error', 'No user found! Please log in.');
    return res.redirect('/auth/login');
  }

  // Condition userList to the current user's Role.
  let userList: IUser[] = [];
  if (currentUser.role === 'SUPER_ADMIN') {
    userList = await User.find().populate('account').sort({ account: 'desc', id: 'asc' });
  } else {
    userList = await User.find({ account: currentUser.account.id }).populate('account');
  }
  return res.render('permissions', { userList, currentUser, selectedUser: false });
};

// export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const user = await User.findById(req.user!.id).populate('account');
//     if (!user) {
//       req.flash('error', 'Invalid ID!');
//       res.status(404);
//     }
//     res.status(200).send(user);
// 
//   } catch (error) {
//     next(error);
//   }
// 
// };

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentUser = req.user;
    const selectedUser = await User.findById(req.params.userId).populate('account');
    if (!selectedUser) {
      req.flash('error', 'Invalid ID!');
      res.redirect('/admin/user'); selectedUser;
      return;
    }
    res.render('profile', { currentUser, selectedUser });
  } catch (error) {
    next(error);
  }
};

export const updateRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, role } = req.body;
    // Verify that the ID and role exist and that the ID is a valid Mongo ID
    if (!userId || !role || !mongoose.Types.ObjectId.isValid(userId)) {
      req.flash('error', 'Invalid Request');
      return res.redirect('back');
    }

    const rolesArray = Object.values(roles);
    if (!rolesArray.includes(role)) {
      req.flash('error', 'Invalid Role.');
      return res.redirect('back');
    }

    // Ensure that Admins can't remove themselves as Admins to ensure that there is always at least one admin
    if (req.user!.id === userId) {
      req.flash('warning', 'Admins cannot remove themselves from Admin role. Please ask another Admin to do it for you.');
      return res.redirect('back');
    }

    // Update User on database
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true, runValidators: true });
    req.flash('info', `updated role for ${user!.email} to ${user!.role}`);
    return res.redirect('back');

  } catch (error) {
    next(error);
  }
};

