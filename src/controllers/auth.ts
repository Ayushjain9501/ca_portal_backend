import express = require('express');
import User = require('../models/user');
import jwt = require('jsonwebtoken');
import { JWT_SECRET } from "../config/keys";
import { authRequest } from "../helpers/req";

export function authHandleFBLogin (req: express.Request, res: express.Response) {
    if (!req.user) {
        return res.status(401).json({
            Error: "User not authenticated"
        });
    }
    else {
        let token = jwt.sign({id: req.user._id}, JWT_SECRET);
        res.setHeader('x-auth-token', token);
        res.status(200).json({
            Ok: true,
            UserId: req.user._id
        })
    }
}

export function authEnsureLogin (req: authRequest, res: express.Response, next: express.NextFunction) {
    const token = req.headers['x-auth-token'];
    if (!token) {
        res.status(403).json({
            Error: "User not authenticated",
            ErrorDescription: 'No token found on headers'
        });
        return;
    }
    jwt.verify(token.toString(), JWT_SECRET, (error: any, decoded: any) => {
        if (error || !decoded) {
            res.status(401).json({
                Error: "x-auth-token invalid"
            });
            return;
        }
        req.userID = decoded.id;
        console.log(req.userID);
        next();
    })
}

export function authSuccessLogin (req: authRequest, res: express.Response) {
    res.status(200).json({
        Ok: true,
        UserId: req.userID
    });
}

export function authHandleError (error: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    if (error) {
        res.status(401).json({
            Error: "Authentcation Error",
            ErrorDescription: error.message
        })
    }
    else {
        res.status(401).json({
            Error: "User not authenticated"
        })
    }
}
