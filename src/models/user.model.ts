import { Schema, model, } from "mongoose";
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
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

export const User = model('user', UserSchema);