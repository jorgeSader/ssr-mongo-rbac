import { Model, Schema, Types, model, } from "mongoose";
import bcrypt from 'bcryptjs';
import createHttpError from "http-errors";

export interface IUser {
  id?: Types.ObjectId;
  email: string;
  password: string;
}

export interface IUserMethods {
  isValidPassword (password: string): Promise<boolean>;

}

export type UserModel = Model<IUser, {}, IUserMethods>;


const UserSchema = new Schema<IUser, UserModel, IUserMethods>({
  email: {
    type: String,
    require: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  }
});

UserSchema.pre('save', async function (next) {
  try {
    if (this.password && this.isNew) {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
      next();
    }
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

export const User = model('user', UserSchema);