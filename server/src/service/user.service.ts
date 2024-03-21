import { FilterQuery } from "mongoose";
import User, { UserModel } from "../models/user.model";
import { CreateUserInput } from "../schema/user.schema";
import { omit } from "lodash";

export async function createUser(
  input: CreateUserInput["body"]
) {
  try {
    const user = await User.create(input);
    return omit(user.toJSON(), ['password', 'salt'])
  } catch (error: any) {
    throw new Error(error);
  };
};

export async function validatePassword(
  { email, password }: { email: string, password: string }
) {
  try {
    const user = await User.findOne({ email });

    if (!user) return;

    const isValid = await user.comparePassword(password);

    if (!isValid) return;

    return omit(user.toJSON(), ['password', 'salt'])
  } catch (error: any) {
    throw new Error(error);
  };
};

export async function findUser(query: FilterQuery<UserModel>) {
  try {
    return User.findOne(query).lean();
    // return omit(user?.toJSON(), ['password', 'salt']);
  } catch (error: any) {
    throw new Error(error);
  };
};


export async function getManyUser() {
  try {
    const users = await User.find({});
    return users;
  } catch (error: any) {
    throw new Error(error);
  }
}