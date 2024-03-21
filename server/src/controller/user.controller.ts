import { Request, Response } from "express";
import logger from "../utils/logger";
import { createUser, getManyUser } from "../service/user.service";
import { CreateUserInput } from "../schema/user.schema";

export async function createUserHandler(
  request: Request<{}, {}, CreateUserInput["body"]>,
  response: Response
) {
  try {
    const user = await createUser(request.body);
    return response.send(user);
  } catch (error: any) {
    logger.error(error);
    return response.status(409).send(error.message);
  }
};

export async function findUsersHandler(
  request: Request,
  response: Response
) {
  try {
    const users = await getManyUser();
    return response.send(users);
  } catch (error: any) {
    logger.error(error);
    return response.status(401).send(error.message);
  };
};