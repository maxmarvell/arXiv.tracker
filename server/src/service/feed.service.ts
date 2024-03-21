import { FilterQuery } from "mongoose";
import Feed, { FeedModel } from "../models/feed.model";
import { CreateFeedInput, GetFeedInput, UpdateFeedInput } from "../schema/feed.schema";
import logger from "../utils/logger"

export async function createFeed(
  input: CreateFeedInput['body'] & { userId: string }
) {
  try {
    return Feed.create(input);
  } catch (error: any) {
    throw new Error(error);
  };
};

export async function getFeedById(
  input: GetFeedInput['params']
) {
  try {
    const feed = Feed.findById(input.feedId);
    return feed;
  } catch (error: any) {
    throw new Error(error);
  };
};

export async function findFeed(
  input: FilterQuery<FeedModel>
) {
  try {
    return Feed.find(input);
  } catch (error: any) {
    throw new Error(error);
  };
};

export async function deleteFeed(
  input: GetFeedInput['params']
) {
  try {
    return Feed.findByIdAndDelete(input.feedId)
  } catch (error: any) {
    throw new Error(error);
  };
};

export async function updateFeed(
  input: UpdateFeedInput
) {
  const { params, body } = input;
  try {
    return Feed.findByIdAndUpdate(params.feedId, body);
  } catch (error: any) {
    throw new Error(error);
  };
};