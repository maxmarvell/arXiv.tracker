import { Request, Response, NextFunction } from "express";
import { get } from "lodash";
import { verifyJwt } from "../utils/jwt.utils";
import logger from "../utils/logger"
import { reIssueAccessToken } from "../service/session.service";

async function deserializeUser(request: Request, response: Response, next: NextFunction) {
  const accessToken = get(request, "headers.authorization", "").replace(/^Bearer\s/, "");
  const refreshToken = get(request, "headers.x-refresh") as string;

  if (!accessToken) return next();

  const { decoded, expired } = verifyJwt(accessToken);

  if (decoded) {
    response.locals.user = decoded;
    return next();
  };

  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken })

    if (newAccessToken) {
      response.setHeader("x-access-token", newAccessToken)
      const result = verifyJwt(newAccessToken);
      response.locals.user = result.decoded;
    };
  };

  return next();
};

export default deserializeUser;