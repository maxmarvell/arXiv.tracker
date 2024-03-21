import { Request, Response } from "express";
import { validatePassword } from "../service/user.service";
import { createSession, findSessions, updateSession } from "../service/session.service";
import { signJwt } from "../utils/jwt.utils";
import config from 'config';
import logger from '../utils/logger';

export async function createUserSessionHandler(request: Request, response: Response) {
  try {
    const user = await validatePassword(request.body);

    if (!user) {
      return response.status(401).send("Invalid email or password")
    };

    // create session
    const session = await createSession(user._id.toString(), request.get("user-agent") || "");

    // create access token
    const accessToken = signJwt(
      { ...user, session: session._id.toString() },
      { expiresIn: config.get("accessTokenTtl") } // 15 minutes
    );

    // create refresh token 
    const refreshToken = signJwt(
      { ...user, session: session._id.toString() },
      { expiresIn: config.get("refreshTokenTtl") } // 1 year
    );

    return response.send({ accessToken, refreshToken });

  } catch (error: any) {
    logger.error(error.message);
    return response.status(401).send(error.message)
  }
};

export async function getUserSessionHandler(request: Request, response: Response) {
  const userId = response.locals.user._id;

  const sessions = await findSessions({ user: userId, valid: true });

  return response.send(sessions);
};

export async function deleteSessionHandler(request: Request, response: Response) {
  const sessionId = response.locals.user.session;

  await updateSession({ _id: sessionId }, { valid: false });

  return response.send({
    accessToken: null,
    refreshToken: null,
  })
};