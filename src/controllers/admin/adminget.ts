import express = require("express");
import User = require("../../models/user");
import Post = require("../../models/post");
import Task = require("../../models/task");
import TicketsData = require("../../models/ticketsData");

export async function aGetUsers(req: express.Request, res: express.Response) {
  try {
    const users: any = await User.find({});
    let resData = [];
    for (let i = 0; i < users.length; i++) {
      resData.push({
        userId: users[i]._id,
        name: users[i].name,
        totalPoints: users[i].totalPoints,
        email: users[i].email,
        regDate: users[i].registerDate
      });
    }
    res.status(200).json({
      count: users.length,
      users: resData
    });
  } catch (err) {
    res.status(401).json({
      Error: "Unknown database error"
    });
  }
}

export async function aGetPosts(req: express.Request, res: express.Response) {
  try {
    const posts: any = await Post.find({});
    let resData = [];
    for (let i = 0; i < posts.length; i++) {
      resData.push({
        postId: posts[i]._id,
        fbURL: posts[i].fbURL,
        maxShares: posts[i].maxShare,
        expDate: posts[i].expTime
      });
    }
    res.status(200).json({
      count: posts.length,
      posts: resData
    });
  } catch (err) {
    res.status(401).json({
      Error: "Unknown database error"
    });
  }
}

export async function aGetTasks(req: express.Request, res: express.Response) {
  try {
    const tasks: any = await Task.find({});
    let resData = [];
    for (let i = 0; i < tasks.length; i++) {
      resData.push({
        taskId: tasks[i]._id,
        taskTitle: tasks[i].taskTitle,
        points: tasks[i].points,
        expDate: tasks[i].expTime
      });
    }
    res.status(200).json({
      count: tasks.length,
      tasks: resData
    });
  } catch (err) {
    res.status(401).json({
      Error: "Unknown database error"
    });
  }
}

export async function aGetTask(req: express.Request, res: express.Response) {
  try {
    const taskId = String(req.params.id);
    const task: any = await Task.findById(taskId);
    res.status(200).json({
      count: 1,
      task: task
    });
  } catch (err) {
    res.status(401).json({
      Error: "Unknown database error"
    });
  }
}

export async function aGetPost(req: express.Request, res: express.Response) {
  try {
    const postId = String(req.params.id);
    const post: any = await Post.findById(postId);
    res.status(200).json({
      count: 1,
      postId: post._id,
      fbURL: post.fbURL,
      imageURL: post.imageURL,
      content: post.content,
      expTime: post.expTime,
      maxShare: post.maxShare,
      totalShares: post.totalShares
    });
  } catch (err) {
    res.status(401).json({
      Error: "Unknown database error"
    });
  }
}


export async function aGetUser(req: express.Request, res: express.Response) {
  try {
    const userId = String(req.params.id);
    const user: any = await User.findById(userId);
    res.status(200).json({
      count: 1,
      user: user
    });
  } catch (err) {
    res.status(401).json({
      Error: "Unknown database error",
      error: err
    });
  }
}

async function getTotalShares() {
  const posts: any = await Post.find({});
  let totalShares = 0;
  for (let i = 0; i < posts.length; i++) {
    totalShares += posts[i].totalShares;
  }
  return totalShares;
}

async function getTotalTaskCompletes() {
  const tasks: any = await Task.find({});
  let totalCompletes = 0;
  for (let i = 0; i < tasks.length; i++) {
    totalCompletes += tasks[i].totalCompletes;
  }
  return totalCompletes;
}

export async function aGetDashboard(req: express.Request, res: express.Response) {
  try {
    const totalPosts = await Post.estimatedDocumentCount();
    const totalUsers = await User.estimatedDocumentCount();
    const totalPostsShared = await getTotalShares();
    const totalTasksComplete = await getTotalTaskCompletes();
    const ticketsData:any = await TicketsData.findOne({});
    const totalTicketsSold = ticketsData.totalTicketsSold;
    const totalCashback =  ticketsData.cashbackPerTicket * totalTicketsSold;
    res.status(200).json({
      count: 6,
      totalPosts,
      totalUsers,
      totalPostsShared,
      totalTasksComplete,
      totalTicketsSold,
      totalCashback
    });
  } catch (err) {
    res.status(401).json({
      Error: "Unknown database error",
      error: err
    });
  }
}


export function dataHandleError(
  error: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  res.status(401).json({
    Error: "Unexpected error",
    ErrorDescription: error ? error.message : "No description provided"
  });
  return;
}
