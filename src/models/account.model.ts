import { Schema, Types, model, } from "mongoose";

export interface IAccount {
  id?: Types.ObjectId;
  name?: string;
}

const accountSchema = new Schema<IAccount>({

  name: String,
},
  { timestamps: true }
);

export default model('Account', accountSchema);