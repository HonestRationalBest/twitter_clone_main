import { model, Schema, Document } from "mongoose";
import { UserModelInterface } from "./User";

export interface TweetModelInterface {
  _id?: string;
  user: string;
  text: string;
}

export type TweetModelDocumentInterface = TweetModelInterface & Document;

const TweetSchema = new Schema<TweetModelInterface>({
  user: {
    require: true,
    ref: "User",
    type: Schema.Types.ObjectId,
  },
  text: {
    require: true,
    ref: "User",
    type: String,
  },
});

export const TweetModel = model<TweetModelDocumentInterface>(
  "Tweet",
  TweetSchema
);
