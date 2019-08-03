import express = require("express");
import bodyParser = require("body-parser");
import passport = require("passport");
import passportConfig = require("./config/passport.conf");
import mongoose = require("mongoose");
import mongooseConfig = require("./config/mongoose.conf");
import authRouter = require("./routes/auth");
import dataRouter = require("./routes/data");
import adminRouter = require("./routes/admin");
import { handleServerError } from './helpers/req';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set CORS Headers (for devel only)
app.use((req, res, next) => {
  // No need of CORS Headers in production
  if (process.env.NODE_ENV !== 'production') {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE"
    );
  }
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-auth-token, x-ad-auth-token"
  );
  res.setHeader(
    "Access-Control-Expose-Headers",
    "Content-Type, x-auth-token, x-ad-auth-token"
  );
  next();
});

// Load Configs
mongooseConfig(mongoose);
passportConfig(passport);

// Load Routes
app.use("/", authRouter);
app.use("/data", dataRouter);
app.use("/admax", adminRouter);

// error handler
app.use(handleServerError);

export = app;
