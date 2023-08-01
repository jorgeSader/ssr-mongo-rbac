import { Model, Schema, Types, model, } from "mongoose";
import bcrypt from 'bcryptjs';
import createHttpError from "http-errors";

export interface IUser {
  id?: Types.ObjectId;
  googleId?: string;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
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
});

UserSchema.pre('save', async function (next) {
  try {
    if (this.isNew && this.password) {
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

UserSchema.virtual('domain').get(function () {
  return this.email.slice(this.email.indexOf('@') + 1);
});

const User = model('user', UserSchema);

export { User };