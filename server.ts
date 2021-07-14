import dotenv from "dotenv";
dotenv.config();
import express from "express";
import config from "config";
import mongoose from "mongoose";
import cors from "cors";
import { UserCtrl } from "./controllers/UserController";
import { registerValidations } from "./validations/register";
import { passport } from "./core/passport";
import { createTweetValidations } from "./validations/createTweet";
import { TweetCtrl } from "./controllers/TweetController";
const app = express();
app.use(express.static("public"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(passport.initialize());

app.get("/users", UserCtrl.getAll);
app.get("/users/verify", UserCtrl.verify);
app.get(
  "/users/me",
  passport.authenticate("jwt", { session: false }),
  UserCtrl.getUserInfo
);
app.get("/users/:id", UserCtrl.get);
app.post("/users/register", registerValidations, UserCtrl.create);
app.post("/users/login", passport.authenticate("local"), UserCtrl.afterLogin);

app.post(
  "/tweets",
  passport.authenticate("jwt"),
  createTweetValidations,
  TweetCtrl.create
);
app.get("/tweets", TweetCtrl.getAll);
app.get("/tweets/:id", TweetCtrl.get);
app.delete("/tweets/:id", passport.authenticate("jwt"), TweetCtrl.delete);

const mongoUri: string = process.env.MONGO_URI || config.get("mongoUri");
const start = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    app.listen(Number(process.env.PORT), () =>
      console.log(`App has been started on port ${process.env.PORT}`)
    );
  } catch (e) {
    console.log("Server Error", e.message);
    throw new Error(e);
  }
};

start();
