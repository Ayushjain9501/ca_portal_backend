import express = require('express');
import base64 = require('base-64');
import User = require('../models/user');
import Post = require('../models/post');
import Task = require('../models/task');
import Coupon50 = require('../models/coupon50');
import Coupon100 = require('../models/coupon100');
import { DEFAULT_POST_CREDIT } from "../config/keys";
import { authRequest } from "../helpers/req";
import { createSamplePost, createSampleTask } from "../helpers/user";

var ObjectId = require('mongoose').Types.ObjectId;


async function getShares(user: any, postID: string) {
    const sharedPosts = await user.postShared;

    for (let i = 0; i < sharedPosts.length; i++) {
        if (String(sharedPosts[i].postid) == String(postID)) {
            return Number(sharedPosts[i].shares);
        }
    }
    return 0;
}


async function getTaskStatus(user: any, taskID: string) {
    const tasksCompleted = await user.tasksCompleted;

    for (let i = 0; i < tasksCompleted.length; i++) {
        if (String(tasksCompleted[i].taskid) == String(taskID)) {
            return true;
        }
    }
    return false;
}

function getRank(sorted: any, userid: string) {
    let i = 0;
    for (; i < sorted.length; i++) {
        if (String(sorted[i]._id) == String(userid)) {
            return i + 1;
        }
    }
    return i + 1;
}


function getLeaderboard(sorted: any) {
    let i = 0;
    let lb = [];
    for (; i < sorted.length; i++) {
        lb.push({
            name: sorted[i].name
        })
    }
    return lb;
}


export async function getPosts(req: authRequest, res: express.Response) {
    // createSamplePost();

    const user = await User.findById(req.userID);
    if (!user) {
        res.status(405).json({
            Error: "Error userid not found",
            ErrorDescription: "token is valid but userID is not"
        })
        return;
    }
    try {
        let currTime = new Date();
        const posts: any = await Post.find({ expTime: { $gt: currTime } }).sort({ "expTime": -1 });
        let resData = [];

        for (let i = 0; i < posts.length; i++) {
            let shares = await getShares(user, posts[i]._id);
            resData.push({
                postID: posts[i]._id,
                postFBID: posts[i].fbID,
                postURL: posts[i].fbURL,
                postImage: posts[i].imageURL,
                postContent: posts[i].content,
                expTime: posts[i].expTime,
                maxShare: posts[i].maxShare,
                shares: shares
            })
        }
        res.status(200).json({
            count: posts.length,
            posts: resData
        });
    } catch (error) {
        res.status(406).json({
            Error: "Internal Database Error",
            ErrorDescription: (error) ? error.message : "No description provided"
        });
    }
    return;
}


export async function getTasks(req: authRequest, res: express.Response) {
    // createSampleTask();

    const user = await User.findById(req.userID);
    if (!user) {
        res.status(405).json({
            Error: "Error userid not found",
            ErrorDescription: "token is valid but userID is not"
        })
        return;
    }
    try {
        let currTime = new Date();
        const tasks: any = await Task.find({ expTime: { $gt: currTime } }).sort({ "expTime": -1 });
        let resData = [];

        for (let i = 0; i < tasks.length; i++) {
            let completed = await getTaskStatus(user, tasks[i]._id);
            resData.push({
                taskID: tasks[i]._id,
                taskTitle: tasks[i].taskTitle,
                taskContent: tasks[i].taskContent,
                expTime: tasks[i].expTime,
                points: tasks[i].points,
                isCompleted: completed
            })
        }
        res.status(200).json({
            count: tasks.length,
            tasks: resData
        });
    } catch (error) {
        res.status(406).json({
            Error: "Internal Database Error",
            ErrorDescription: (error) ? error.message : "No description provided"
        });
    }
    return;
}


export async function getDataSummery(req: authRequest, res: express.Response) {

    const user: any = await User.findById(req.userID);
    if (!user) {
        res.status(405).json({
            Error: "Error user not found",
            ErrorDescription: "token is valid but userID is not valid"
        })
        return;
    }
    try {
        let leaderBoard = [];
        let sorted = [];
        let totalPoints, postsShared, rank, refCode, tasksCompleted, ticketsBooked, userName;
        let userCoupons = await  user.redeemed_coupons;

        totalPoints = Number(user.totalPoints);
        userName = String(user.name);
        refCode = String(user.refCode);
        postsShared = Number(user.totalPostsShared);
        ticketsBooked = Number(user.ticketsBooked);
        tasksCompleted = await Number(user.tasksCompleted.length);

        sorted = await User.find().sort({ "totalPoints": -1, "tasksCompleted": -1, "ticketsBooked": -1 });
        rank = await getRank(sorted, user._id);
        leaderBoard = await getLeaderboard(sorted.slice(0, 10));

        res.status(200).json({
            count: 8,
            userName: userName,
            totalPoints: totalPoints,
            postsShared: postsShared,
            refCode: refCode,
            ticketsBooked: ticketsBooked,
            tasksCompleted: tasksCompleted,
            rank: rank,
            leaderBoard: leaderBoard,
            userCoupons: userCoupons
        });
    } catch (error) {
        res.status(406).json({
            Error: "Internal Database Error",
            ErrorDescription: (error) ? error.message : "No description provided"
        });
    }
    return;
}


export async function getDataCount(req: authRequest, res: express.Response) {
    const user = await User.findById(req.userID);
    if (!user) {
        res.status(405).json({
            Error: "Error user not found",
            ErrorDescription: "token is valid but userID is not valid"
        })
        return;
    }
    try {
        const currTime = new Date();
        const totalPosts = await Post.countDocuments({ expTime: { $gt: currTime } });
        const totalTasks = await Task.countDocuments({ expTime: { $gt: currTime } });

        res.status(200).json({
            totalPosts: totalPosts,
            totalTasks: totalTasks
        });
    } catch (error) {
        res.status(406).json({
            Error: "Internal Database Error",
            ErrorDescription: (error) ? error.message : "No description provided"
        });
    }
    return;
}

export async function increasePoints(req: authRequest, res: express.Response) {
    const user: any = await User.findById(req.userID);
    const postID_encoded = req.body.ID;
    if (!user) {
        res.status(405).json({
            Error: "Error user not found",
            ErrorDescription: "token is valid but userID is not valid"
        })
        return;
    }
    if (!postID_encoded) {
        res.status(405).json({
            Error: "Error no data recieved",
            ErrorDescription: "The data required to this path is NULL"
        })
        return;
    }
    try {
        let postID_decoded = base64.decode(postID_encoded);
        console.log(postID_decoded);
        let postsShared = await user.postShared;
        let post: any = await Post.findById(postID_decoded);
        let date = new Date();
        let need_upsert = true; // Do we need to create a new entry in user->postShared

        if (post.expTime < date) {
            res.status(403).json({
                Error: "Post Expired",
                ErrorDescription: "Post is Expired, can't increase points"
            });
            return;
        }
        for (let i = 0; i < postsShared.length; i++) {
            if (String(postsShared[i].postid) == postID_decoded) {
                if (post.maxShare <= postsShared[i].shares) {
                    res.status(403).json({
                        Error: "Max Shares reached",
                        ErrorDescription: "Can't increase post shares as the max shares are reached"
                    });
                    return;
                }
                need_upsert = false;
                post.totalShares += 1;
                postsShared[i].shares += 1;
                user.totalPostsShared += 1;
                user.totalPoints += DEFAULT_POST_CREDIT;
                await user.save();
                await post.save();
                break;
            }
        }
        if (need_upsert) {
            await postsShared.push({
                postid: post._id,
                shares: 1
            });
            post.totalShares += 1;
            user.totalPostsShared += 1;
            user.totalPoints += DEFAULT_POST_CREDIT;
            await user.save();
            await post.save();
        }
        res.status(200).json({
            count: 1,
            message: "Increased Points"
        });
    } catch (error) {
        res.status(406).json({
            Error: "Internal Database Error",
            ErrorDescription: (error) ? error.message : "No description provided"
        });
    }
    return;
}


export function dataHandleError(error: any, req: authRequest, res: express.Response, next: express.NextFunction) {
    res.status(401).json({
        Error: "Error while fetching data for userID:" + req.userID,
        ErrorDescription: (error) ? error.message : "No description provided"
    })
    return;
}


export async function getCoupon(req: authRequest, res: express.Response) {
    const user: any = await User.findById(req.userID);
    if (!user) {
        res.status(405).json({
            Error: "Error user not found",
            ErrorDescription: "token is valid but userID is not valid"
        })
        return;
    }
    try {
        let ticketSold = Number(user.ticketsBooked);
        let reedemedCouponsLength = await Number(user.redeemed_coupons.length);
        let userId = user._id;

        if (ticketSold >= 10 && reedemedCouponsLength!=2) {
            
            let coupon: any = await findNullCoupon100(userId); 

            user.redeemed_coupons.push({
                coupon_id: coupon._id,
                coupon_code: coupon.coupon_code,
                coupon_type: 100, 
                redeem_date: coupon.redeem_date
            });
            user.save();

            res.status(200).json({
                fetched : true,
                coupon_code: coupon.coupon_code
            });

        }
        else if (ticketSold >= 5 && reedemedCouponsLength == 0) {
           
            let coupon: any = await findNullCoupon50(userId); 

            user.redeemed_coupons.push({
                coupon_id: coupon._id,
                coupon_code: coupon.coupon_code,
                coupon_type: 50, 
                redeem_date: coupon.redeem_date
            });
            user.save();

            res.status(200).json({
                fetched : true,
                coupon_code: coupon.coupon_code
            })
        
        }
        else {
        res.status(200).json({
            fetched : false,
            coupon_code : "Don't be Greedy!!!"
        });
    }
   
    } catch (error) {
        res.status(406).json({
            Error: "Internal Database Error",
            ErrorDescription: (error) ? error.message : "No description provided"
        });
    }

return;

}

async function findNullCoupon50(userId: string) {
    let coupon: any;
    coupon = await Coupon50.findOne({ "user_id": null });
    
    try {
        coupon.user_id = userId;
        coupon.redeem_date = new Date();
        await coupon.save();
    }
    catch (error) {
        console.log(error);
    };
    return coupon;
}

async function findNullCoupon100(userId: string) {
    let coupon: any;
    coupon = await Coupon100.findOne({ "user_id": null });
    
    try {
        coupon.user_id = userId;
        coupon.redeem_date = new Date();
        await coupon.save();
    }
    catch (error) {
        console.log(error);
    };
    return coupon;

}
