import User = require('../models/user');
import jwt = require('jsonwebtoken');
import express = require('express');
import passport = require('passport');
import { authHandleFBLogin, authHandleError, authEnsureLogin, authSuccessLogin, authCheckEmail } from "../controllers/auth";

const router = express.Router();

router.route('/Oauth').post(
    passport.authenticate('facebook-token', { session: false }), 
    authHandleFBLogin,
    authHandleError
);

router.route('/auth').post(
    authEnsureLogin,
    authSuccessLogin,
    authHandleError
);

router.route('/checkEmail').post(
    authCheckEmail,
    authHandleError
);

export = router;