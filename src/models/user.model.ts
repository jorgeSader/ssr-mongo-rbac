import { Model, Schema, Types, model, } from "mongoose";
import bcrypt from 'bcryptjs';
import createHttpError from "http-errors";
import env from 'dotenv';

import Account from "./account.model.js";

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
  account: Types.ObjectId;
  role: string;
  projectIds: Types.ObjectId[];
}

export interface IUserMethods {
  isValidPassword (password: string): Promise<boolean>;
}

export interface IVirtuals {
  domain (): string;
}

export type UserModel = Model<IUser, {}, IUserMethods>;


const userSchema = new Schema<IUser, UserModel, IUserMethods, IVirtuals>(
  {
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
    account: {
      type: Schema.Types.ObjectId,
      ref: 'Account'
    },
    role: {
      type: String,
      enum: [
        roles.superAdmin,
        roles.admin,
        roles.manager,
        roles.employee,
        roles.vendor,
        roles.client
      ],
      default: roles.employee
    },
    projectIds: [{
      type: Schema.Types.ObjectId,
      ref: 'Project'
    }],
  },
  { timestamps: true, }
);

userSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      if (this.password) {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
      }
      if (!this.account) {
        const account = await new Account({
          name: 'ACME,Inc.' // TODO: Make name input dynamic.
        });
        this.account = account.id;
        account.save();
        this.role = roles.admin;
      }
      if (this.email.toLowerCase() === process.env.SUPER_ADMIN_EMAIL?.toLowerCase()) {
        this.role = roles.superAdmin;
      }
    }
    next();
  } catch (error) {
    console.log("🚀 ~ file: user.model.ts:94 ~ error:", error);

    next(error);
  }
});

// Add method to validate password mongoose metho
userSchema.methods.isValidPassword = async function (password: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw createHttpError.InternalServerError(error.message);
  }
};
// mongoose "virtuals" allow us to query "computed" info without storing it. 
// In this case we are using it to retrieve the domain of the user(everything after the "@" on their email).
userSchema.virtual('domain').get(function () {
  return this.email.slice(this.email.indexOf('@') + 1);
});

export default model('User', userSchema);
