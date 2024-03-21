import { get } from "lodash";
import config from "config";
import { FilterQuery, UpdateQuery } from "mongoose";
import Session, { ISession, SessionModel } from "../models/session.model";
import { verifyJwt, signJwt } from "../utils/jwt.utils";
import { findUser } from "./user.service";

export async function createSession(userId: string, userAgent: string) {
  const session = await Session.create({ user: userId, userAgent });
  return session.toJSON();
}

export async function findSessions(query: FilterQuery<SessionModel>) {
  return Session.find(query).lean();
}

export async function updateSession(
  query: FilterQuery<SessionModel>,
  update: UpdateQuery<ISession>
) {
  return Session.updateOne(query, update);
}

export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  const { decoded } = verifyJwt(refreshToken);

  if (!decoded || !get(decoded, "session")) return;

  const session = await Session.findById(get(decoded, "session"));

  if (!session || !session.valid) return;

  const user = await findUser({ _id: session.user });

  if (!user) return;

  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get("accessTokenTtl") } // 15 minutes
  );

  return accessToken;
};