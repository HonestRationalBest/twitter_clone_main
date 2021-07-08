import express from "express";
import { validationResult } from "express-validator";
import { UserModel } from "../models/User";
import { generateMD5 } from "../utils/generateHash";
import { sendEmail } from "../utils/sendMaill";

class UserController {
  async index(req: express.Request, res: express.Response): Promise<void> {
    try {
      const users = await UserModel.find({}).exec();
      res.json({
        status: "success",
        data: users,
      });
    } catch (e) {
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
      const data = {
        email: req.body.email,
        fullname: req.body.fullname,
        username: req.body.username,
        password: req.body.password,
        confirmed_hash: generateMD5(
          process.env.SECREAT_KEY || Math.random().toString()
        ),
      };

      const candidate = UserModel.findOne({
        $or: [{ email: data.email }, { username: data.username }],
      });

      if (candidate) {
        res.status(400).json({
          errors: "error",
          message: "Этот пользователь уже существует!",
        });
      } else {
        const user = await UserModel.create(data);
        sendEmail({
          emailFrom: "admin@twitter.com",
          emailTo: data.email,
          subject: "Подтверждение почты",
          html: `Для того чтобы подтвердить почту, перейдите по ссылке <a href="http://localhost:${
            process.env.PORT || 3001
          }/users/verify?hash=${data.confirmed_hash}">по этой ссылке</a>`,
          callback: function (err: Error | null) {
            if (err) {
              res.status(500).json({
                status: "error",
                message: JSON.stringify(err),
              });
            } else {
              res.status(201).json({
                status: "success",
                data: user,
              });
            }
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
  async verify(req: express.Request, res: express.Response): Promise<void> {
    try {
      const hash = req.query.hash;

      if (!hash) {
        res.status(400).send();
        return;
      }

      const user = await UserModel.findOne({ confirmed_hash: hash }).exec();

      if (user) {
        user.confirmed = true;
        user.save();

        res.json({
          status: "success",
        });
      } else {
        res.status(404).json({
          status: "error",
          message: "Пользователь не найден",
        });
      }
    } catch (e) {
      res.status(500).json({
        status: "error",
        message: JSON.stringify(e),
      });
    }
  }
}

export const UserCtrl = new UserController();
