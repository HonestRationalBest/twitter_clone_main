import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { UserCtrl } from "./controllers/UserController";
import { registerValidations } from "./validations/register";

const app = express();
app.use(express.static("public"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

app.get("/users", UserCtrl.index);
app.post("/users", registerValidations, UserCtrl.create);
app.get("/users/verify", registerValidations, UserCtrl.verify);
// app.patch("/users", UserCtrl.update);
// app.delete("/users", UserCtrl.delete);

const mongoUri: string =
  process.env.MONGO_URI ||
  "mongodb+srv://Pavel:pawel007@cluster0.rc5e7.mongodb.net/twitter";

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
