const express = require("express");
const { uploadFile } = require("../utils/fileUpload");
const { checkDuplicateEmail } = require("../middlewares/verifySignUp");
const {
  login,
  register,
  forgotPassword,
  resetPassword,
  makeRangeIterator,
} = require("../controllers/auth.controller");

const authRouter = express.Router();

authRouter.route("/login").post(login);
authRouter.route("/register").post(uploadFile.single('profileImg'), checkDuplicateEmail, register);
authRouter.route('/forgot-password').post(forgotPassword);
authRouter.route('/reset-password').post((resetPassword));
authRouter.route("/makeRangeIterator").get(makeRangeIterator);

module.exports = authRouter;
