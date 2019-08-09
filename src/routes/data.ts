import User = require('../models/user');
import jwt = require('jsonwebtoken');
import express = require('express');
import passport = require('passport');
import { authEnsureLogin, authHandleError } from "../controllers/auth";
import { getPosts, getTasks, getDataSummery, dataHandleError, getDataCount, increasePoints,getCoupon} from "../controllers/userdata";

const router = express.Router();

// Get Routes ========================================>
router.route('/posts').get(
    authEnsureLogin,
    getPosts,
    dataHandleError
);

router.route('/tasks').get(
    authEnsureLogin,
    getTasks,
    dataHandleError
);

// Dashboard Data Summery
router.route('/datasum').get(
    authEnsureLogin,
    getDataSummery,
    dataHandleError
);

// Data Count
router.route('/datacount').get(
    authEnsureLogin,
    getDataCount,
    dataHandleError
);

// Post Routes =======================================>
router.route('/postgain').post(
    authEnsureLogin,
    increasePoints,
    dataHandleError
);

//Redeem Coupons
router.route('/redeem').get(
    authEnsureLogin,
    getCoupon,
    dataHandleError
)

export = router;