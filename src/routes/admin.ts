import express = require("express");
import {
  aAuthHandleRegister,
  aAuthHandleError,
  aAuthHandleLogin,
  aAuthHandleSuccessLogin,
  aAuthEnsureLogin
} from "../controllers/admin/adminauth";

import {
  aGetPosts,
  aGetTasks,
  aGetUsers,
  aGetTask,
  aGetPost,
  aGetUser,
  aGetDashboard
} from "../controllers/admin/adminget";

import {
  aAddPost,
  aAddTask,
  aMarkTaskComplete,
  aEditPost,
  aEditTask
} from "../controllers/admin/adminpost";

const router = express.Router();

router.route("/registercadmin").post(aAuthHandleRegister, aAuthHandleError);
router.route("/logincadmin").post(aAuthHandleLogin, aAuthHandleError);
router.route("/checklogin").post(aAuthEnsureLogin, aAuthHandleSuccessLogin, aAuthHandleError);

router.route("/dashboard").get(aAuthEnsureLogin, aGetDashboard, aAuthHandleError);
router.route("/users").get(aAuthEnsureLogin, aGetUsers, aAuthHandleError);
router.route("/posts").get(aAuthEnsureLogin, aGetPosts, aAuthHandleError);
router.route("/tasks").get(aAuthEnsureLogin, aGetTasks, aAuthHandleError);
router.route("/post/:id").get(aAuthEnsureLogin, aGetPost, aAuthHandleError);
router.route("/user/:id").get(aAuthEnsureLogin, aGetUser, aAuthHandleError);
router.route("/task/:id").get(aAuthEnsureLogin, aGetTask, aAuthHandleError);

router.route("/addpost").post(aAuthEnsureLogin, aAddPost, aAuthHandleError);
router.route("/addtask").post(aAuthEnsureLogin, aAddTask, aAuthHandleError);
router.route("/marktask").post(aAuthEnsureLogin, aMarkTaskComplete, aAuthHandleError);

router.route("/editpost").post(aAuthEnsureLogin, aEditPost, aAuthHandleError);
router.route("/edittask").post(aAuthEnsureLogin, aEditTask, aAuthHandleError);

export = router;
