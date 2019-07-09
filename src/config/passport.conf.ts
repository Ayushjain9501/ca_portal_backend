import passportFbStrategy = require('passport-facebook-token');
import { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } from "./keys";
import { upsertUser } from "../helpers/user";

function passportConfig(passport: any) {
    passport.use(new passportFbStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
      }, (accessToken, refreshToken, profile, done) => {
        upsertUser(accessToken, refreshToken, profile, done);
      }
    ));
}

export = passportConfig;
