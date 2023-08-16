import { Model, Schema, Types, model, } from "mongoose";
import createHttpError from "http-errors";

export interface IAccount {
  id?: Types.ObjectId;
  name?: string;
  userIds: [string];
}

const accountSchema = new Schema<IAccount>({
  name: String,

});

// accountSchema.pre('save', async function (next) {
//   try {
//     if (this.isNew) {
//       if (this.password) {
//         const hashedPassword = await bcrypt.hash(this.password, 10);
//         this.password = hashedPassword;
//       }
//       if (this.email.toLowerCase() === process.env.SUPER_ADMIN_EMAIL?.toLowerCase()) {
//         this.role = roles.superAdmin;
//       }
//     }
//     next();
//   } catch (error) {
//     next(error);
//   }
// });
// 
// accountSchema.methods.isValidPassword = async function (password: string): Promise<boolean> {
//   try {
//     return await bcrypt.compare(password, this.password);
//   } catch (error) {
//     throw createHttpError.InternalServerError(error.message);
//   }
// };
// // mongoose "virtuals" allow us to query "computed" info without storing it. 
// // In this case we are using it to retrieve the domain of the Account(everything after the "@" on their email).
// accountSchema.virtual('domain').get(function () {
//   return this.email.slice(this.email.indexOf('@') + 1);
// });

export default model('Account', accountSchema);