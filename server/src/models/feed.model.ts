import { Model, Schema, model } from "mongoose"

export interface IFeed {
  cat?: string[]
  max_results?: number
  au?: string[]
  sortBy?: string
  sortOrder?: string
  userId: Schema.Types.ObjectId
  name: string
}

export interface IFeedMethods { }

export type FeedModel = Model<IFeed, {}, IFeedMethods>;

const feedSchema = new Schema<IFeed, FeedModel, IFeedMethods>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    cat: [{ type: String }],
    max_results: { type: Number },
    au: [{ type: String }],
    sortBy: { type: String },
    sortOrder: { type: String },
  },
  {
    timestamps: true,
  }
);

const Feed = model("Feed", feedSchema);

export default Feed;