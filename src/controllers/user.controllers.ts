import { Request, Response, NextFunction } from "express";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import { roles } from "../utils/constants.js";

export const getUserList = async (req: Request, res: Response, next: NextFunction) => {
  const userList = await User.find();
  return res.render('permissions', { userList });
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) {
      req.flash('error', 'Invalid ID!');
      res.status(404);
    }
    res.status(200).send(user);

  } catch (error) {
    next(error);
  }

};
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      req.flash('error', 'Invalid ID!');
      res.redirect('/admin/users');
      return;
    }
    res.render('profile', { user });
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
      req.flash('error', 'Admins cannot remove themselves from Admin role. Please ask another Admin to do it for you.');
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

