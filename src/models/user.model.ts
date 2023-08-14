import { Model, Schema, Types, model, } from "mongoose";
import bcrypt from 'bcryptjs';
import createHttpError from "http-errors";
import env from 'dotenv';
import { roles } from "../utils/constants.js";

env.config();

export interface IUser {
  id?: Types.ObjectId;
  googleId?: string;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  role: string;
}

export interface IUserMethods {
  isValidPassword (password: string): Promise<boolean>;
}

export interface IVirtuals {
  domain (): string;
}

export type UserModel = Model<IUser, {}, IUserMethods>;


const UserSchema = new Schema<IUser, UserModel, IUserMethods, IVirtuals>({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: String,
  googleId: String,
  imageUrl: String,
  firstName: String,
  lastName: String,
  role: {
    type: String,
    enum: [
      roles.admin,
      roles.manager,
      roles.superAdmin,
      roles.employee,
      roles.vendor
    ],
    default: roles.employee
  }
});

UserSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      if (this.password) {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
      }
      if (this.email.toLowerCase() === process.env.SUPER_ADMIN_EMAIL?.toLowerCase()) {
        this.role = roles.superAdmin;
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.isValidPassword = async function (password: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw createHttpError.InternalServerError(error.message);
  }
};
// mongoose "virtuals" allow us to query "computed" info without storing it. 
// In this case we are using it to retrieve the domain of the user(everything after the "@" on their email).
UserSchema.virtual('domain').get(function () {
  return this.email.slice(this.email.indexOf('@') + 1);
});

const User = model('user', UserSchema);

export { User };