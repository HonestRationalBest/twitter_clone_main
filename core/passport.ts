import passport from "passport";
import config from "config";

import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { UserModel, UserModelInterface } from "../models/User";
import { generateMD5 } from "../utils/generateHash";

passport.use(
  new LocalStrategy(
    async (username: string, password: string, done): Promise<void> => {
      try {
        const user = await UserModel.findOne({
          $or: [{ email: username }, { username }],
        }).exec();
        if (!user.confirmed) {
          return done(null, false);
        }
        if (!user) {
          return done(null, false);
        }
        if (user.password === generateMD5(password + process.env.SECRET_KEY)) {
          done(null, user);
        } else {
          done(null, false);
        }
      } catch (error) {
        console.log(error);
        done(error, false);
      }
    }
  )
);

passport.use(
  new JwtStrategy(
    {
      secretOrKey: process.env.SECRET_KEY || config.get("secretKey"),
      jwtFromRequest: ExtractJwt.fromHeader("token"),
    },
    async (payload, done) => {
      try {
        console.log(payload);
        const user = await UserModel.findById(payload.userId).exec();
        if (user) {
          return done(null, user);
        }
        done(null, false);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  UserModel.findById(id, (err: any, user: UserModelInterface) => {
    done(err, user);
  });
});

export { passport };
