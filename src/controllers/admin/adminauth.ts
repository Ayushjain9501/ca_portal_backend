import express = require('express');
import Admin = require('../../models/admin');
import bcrypt = require('bcryptjs');
import jwt = require('jsonwebtoken');
import { ADMIN_REGISTER_SECRET, ADMIN_JWT_SECRET } from '../../config/keys';

export async function aAuthHandleRegister (req: express.Request, res: express.Response) {
    const secret = req.body.admin_secret;
    if (secret !== ADMIN_REGISTER_SECRET) {
        res.status(404).json({
            Error: "Cannot post /registercadmin"
        });
        return;
    }
    else {
        const userName = req.body.userName;
        const userId = req.body.userId;
        const pass = req.body.pass;

        if (!userName || !userId || !pass) {
            return res.status(404).json({
                Error: "Cannot post /registercadmin"
            });
        }
        await bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(pass, salt, function(err, hash) {
                const newAdmin = {
                    name: userName,
                    userId: userId,
                    password: hash
                };
                new Admin(newAdmin).save().then(admin => {
                    return res.status(200).json({
                        Ok: true
                    });
                });
            });
        });
    }
}

export async function aAuthHandleLogin (req: express.Request, res: express.Response) {
    const adminId = req.body.adminId;
    const pass = req.body.pass;
    if (!adminId || !pass) {
        res.status(403).json({ Ok: false });
        return;
    }
    try {
    const admin: any = await Admin.findOne({userId: adminId});
    const hashedPass = await admin.password;
    bcrypt.compare(pass, hashedPass).then((resp) => {
        if (resp == false) {
            res.status(403).json({ Ok: false });
            return;
        }
        let token = jwt.sign({id: adminId}, ADMIN_JWT_SECRET, { expiresIn: '15d' });
        res.setHeader('x-ad-auth-token', token);
        admin.lastTokenGenerate = new Date();
        admin.save().then(() => {
            res.status(200).json({ Ok: true });
        });
    })} catch (err) {
        // console.log(err);
        res.status(403).json({ Ok: false });
    }
}

export function aAuthEnsureLogin (req: express.Request, res: express.Response, next: express.NextFunction) {
    const token = req.headers['x-ad-auth-token'];
    if (!token) {
        res.status(403).json({Ok: false});
        return;
    }
    jwt.verify(token.toString(), ADMIN_JWT_SECRET, (error: any, decoded: any) => {
        if (error && error.name == 'TokenExpiredError') {
            res.status(402).json({
                Error: "TokenExpiredError",
                ErrorDescription: "JWT is expired"
            });
            return;
        }
        if (!decoded) {
            res.status(403).json({
                Error: "token error"
            });
            return;
        }
        next();
    })
}

export function aAuthHandleSuccessLogin (req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(200).json({
        Ok: true
    });
}

export function aAuthHandleError (error: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(405).json({
        Error: "Unknown auth error"
    });
}