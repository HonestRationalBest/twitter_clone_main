import express from "express";
import { validationResult } from "express-validator";
import { generateMD5 } from "../utils/generateHash";
import { isValidObjectId } from "mongoose";
import { TweetModel, TweetModelInterface } from "../models/Tweet";
import { UserModelInterface } from "../models/User";

class TweetController {
  async getAll(req: express.Request, res: express.Response): Promise<void> {
    try {
      const tweets = await TweetModel.find({}).exec();
      res.json({
        status: "success",
        data: tweets,
      });
    } catch (e) {
      console.log(e);
      res.json({
        status: "error",
        message: JSON.stringify(e),
      });
    }
  }
  async get(req: express.Request, res: express.Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        res.status(400).send();
        return;
      }

      const tweet = await TweetModel.findById(id).exec();
      if (!tweet) {
        res.status(404).send();
        return;
      }
      res.json({
        status: "success",
        data: {
          id: tweet._id,
          text: tweet.text,
          user: tweet.user,
        },
      });
    } catch (e) {
      console.log(e);
      res.json({
        status: "error",
        message: JSON.stringify(e),
      });
    }
  }
  async create(req: express.Request, res: express.Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          errors: errors.array(),
          message: "Некорректные данные",
        });
        return;
      }

      const user = req.user as UserModelInterface;

      if (user?._id) {
        const data: TweetModelInterface = {
          user: user._id,
          text: req.body.text,
        };
        const tweet = await TweetModel.create(data);
        tweet.save();
        res.status(201).json({
          status: "success",
          data: {
            id: tweet._id,
            text: tweet.text,
            user: tweet.user,
          },
        });
      }
    } catch (e) {
      res.json({
        status: "error",
        message: JSON.stringify(e),
      });
    }
  }
  async delete(req: express.Request, res: express.Response): Promise<void> {
    try {
      const user = req.user as UserModelInterface;

      if (user) {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
          res.status(400).send();
          return;
        }
        const tweet = await TweetModel.findById(id);
        if (tweet) {
          tweet.remove();
          res.status(200).json({
            status: "success",
          });
        } else {
          res.status(404).json({
            status: "error",
          });
        }
      }
    } catch (e) {
      res.json({
        status: "error",
        message: JSON.stringify(e),
      });
    }
  }
}

export const TweetCtrl = new TweetController();
