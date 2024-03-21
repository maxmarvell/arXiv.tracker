import mongoose, { PopulatedDoc, Model, Schema } from "mongoose";
import User, { IUser, UserMethods, UserModel } from "./user.model";

export interface ISession {
  user: Schema.Types.ObjectId;
  valid: boolean;
  userAgent: string;
}

export type SessionModel = Model<ISession, {}, {}>

const sessionSchema = new Schema<ISession, SessionModel, {}>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    valid: { type: Boolean, default: true },
    userAgent: { type: String },
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;