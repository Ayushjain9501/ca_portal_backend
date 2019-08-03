import express = require("express");
import User = require("../../models/user");
import Post = require("../../models/post");
import Task = require("../../models/task");

export async function aAddPost(req: express.Request, res: express.Response) {
  try {
    const content = String(req.body.content).slice(0, 200) + "...";

    const newPost = {
      fbURL: String(req.body.fbURL),
      imageURL: String(req.body.imageURL),
      content: content,
      expTime: req.body.expTime,
      maxShare: Number(req.body.maxShare)
    };
    await new Post(newPost).save();
    res.status(200).json({
      Ok: true
    });
  } catch (err) {
    res.status(401).json({
      Ok: false,
      Error: "Unknown database error"
    });
  }
}

export async function aEditPost(req: express.Request, res: express.Response) {
  try {
    let post: any = await Post.findById(req.body.postId);
    
    const content = String(req.body.content).slice(0, 200) + "...";
    post.fbURL = String(req.body.fbURL),
    post.imageURL = String(req.body.imageURL),
    post.content = content,
    post.expTime = req.body.expTime,
    post.maxShare = Number(req.body.maxShare)

    await post.save();
    res.status(200).json({
      Ok: true
    });
  } catch (err) {
    res.status(401).json({
      Ok: false,
      Error: "Unknown database error"
    });
  }
}

export async function aAddTask(req: express.Request, res: express.Response) {
  try {
    const newTask = {
      taskTitle: String(req.body.taskTitle),
      taskContent: String(req.body.taskContent),
      points: Number(req.body.points),
      expTime: req.body.expTime,
      totalCompletes: 0
    };
    await new Task(newTask).save();
    res.status(200).json({
      Ok: true
    });
  } catch (err) {
    res.status(401).json({
      Ok: false,
      Error: "Unknown database error"
    });
  }
}

export async function aEditTask(req: express.Request, res: express.Response) {
  try {
    let task:any = await Task.findById(req.body.taskId);

    task.taskTitle = String(req.body.taskTitle),
    task.taskContent = String(req.body.taskContent),
    task.points = Number(req.body.points),
    task.expTime = req.body.expTime,

    await task.save();
    res.status(200).json({
      Ok: true
    });
  } catch (err) {
    res.status(401).json({
      Ok: false,
      Error: "Unknown database error"
    });
  }
}

export async function aMarkTaskComplete( req: express.Request, res: express.Response ) {
  try {
    let userId = req.body.userId;
    let taskId = req.body.taskId;

    let user: any = await User.findById(userId);
    let task: any = await Task.findById(taskId);

    for (let i = 0; i < user.tasksCompleted.length; i++) {
      if (String(user.tasksCompleted[i].taskid) == String(taskId)) {
        res.status(200).json({
          Ok: true
        });
        console.log("sdsdsdsdsdsdsdsd");
        return;
      }
    }
    user.tasksCompleted.push({
        taskid: task._id,
        completedOn: new Date()
    });
    user.totalPoints += task.points;
    task.totalCompletes += 1;
    await user.save();
    await task.save();
    res.status(200).json({
      Ok: true
    });
  } catch (err) {
    console.log(err)
    res.status(401).json({
      Ok: false,
      Error: "Unknown database error"
    });
  }
}
