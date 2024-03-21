import { Request, Response } from "express";
import { CreateFeedInput, DeleteFeedInput, GetFeedInput, UpdateFeedInput } from "../schema/feed.schema";
import { createFeed, deleteFeed, findFeed, getFeedById, updateFeed } from "../service/feed.service";


export async function createFeedHandler(
  request: Request<{}, {}, CreateFeedInput["body"]>,
  response: Response
) {
  try {
    // get user
    const user = response.locals.user;

    if (!user) response.status(403).send({ message: "user must be authenticated"})

    // create feed
    const feed = await createFeed({
      ...request.body,
      userId: user._id
    });

    return response.status(201).send(feed);

  } catch (error: any) {
    throw new Error(error)
  }
};

export async function findUserFeedsHandler(
  request: Request,
  response: Response
) {
  try {
    // get user
    const user = response.locals.user;

    if (!user) response.status(403).send({ message: "user must be authenticated"})

    const feeds = await findFeed({
      userId: user._id
    });

    return response.status(200).send(feeds)

  } catch (error: any) {
    throw new Error(error)
  }
};


export async function updateFeedHandler(
  request: Request<UpdateFeedInput["params"], {}, UpdateFeedInput["body"]>,
  response: Response
) {
  let { body, params } = request;
  try {
    // get user
    const user = response.locals.user;

    await updateFeed({ body, params });

    return response.status(204).send()

  } catch (error: any) {
    throw new Error(error);
  };
};


export async function deleteFeedHandler(
  request: Request<DeleteFeedInput["params"]>,
  response: Response
) {
  try {
    const user = response.locals.user;

    await deleteFeed(request.params);

    return response.status(204).send();

  } catch (error: any) {
    throw new Error(error);
  };
};

export async function getFeedHandler(
  request: Request<GetFeedInput["params"]>,
  response: Response
) {
  try {
    const user = response.locals.user;

    const feed = await getFeedById(request.params);

    if (!feed) return response.status(404).send({ message: "resource not found!"})

    return response.status(200).send(feed)
  } catch (error: any) {
    throw new Error(error);
  };
};