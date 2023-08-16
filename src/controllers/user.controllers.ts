import { Request, Response, NextFunction } from "express";
import User from "../models/user.model.js";

export const getUserList = async (req: Request, res: Response, next: NextFunction) => {
  const userList = await User.find();
  console.log("🚀 ~ file: user.controllers.ts:5 ~ getUserList ~ userList:", userList);

  return res.status(211).send(userList);
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
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