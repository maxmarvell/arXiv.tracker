import mongoose, { Model, Schema, Types } from "mongoose";
import crypto from "crypto";
import config from "config";

export interface UserInput {
  email: string;
  name: string;
  password: string;
}

export interface IUser extends UserInput {
  salt: string;
}

export interface UserMethods {
  comparePassword(candidatePassword: string): Promise<Boolean>;
}

export type UserModel = Model<IUser, {}, UserMethods>;

const userSchema = new Schema<IUser, UserModel, UserMethods>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false }
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {

  let user = this;

  if (!user.isModified("password")) {
    return next();
  };

  const salt = crypto.randomBytes(16).toString("hex");

  user.salt = salt;

  /*
   * Create a hash with 1000 iterations
   */
  const hash = crypto
    .pbkdf2Sync(user.password, salt, 1000, 64, "sha512")
    .toString("hex");

  user.password = hash;

  return next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this;

  return crypto
    .pbkdf2Sync(candidatePassword, user.salt, 1000, 64, "sha512")
    .toString("hex") === user.password;
};

const User = mongoose.model("User", userSchema);
export default User;
