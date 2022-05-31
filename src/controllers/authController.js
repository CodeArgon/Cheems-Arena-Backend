import status from "http-status";
import { sendForgotPasswordEmail } from "../utils/sendEmail.js";
import { ForgotPasswordToken } from "../models/forgotPasswordToken.js";
import { User } from "../models/users.js";
import { God } from "../models/gods.js";
import bcrypt from "bcryptjs";
import APIError from "../utils/APIError.js";

const authController = {
  forgotPassword: async (req, res, next) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({
        where: {
          email,
        },
        include: [ForgotPasswordToken],
      });

      if (!user) {
        throw new Error("No User found with the email address");
      } else {
        let code = generatePassword();
        const subject = "Forgot Password";
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(code, salt);

        await User.update(
          {
            password,
          },
          {
            where: {
              id: user.id,
            },
          }
        );

        sendForgotPasswordEmail(email, subject, code);
      }

      res.status(status.CREATED).json({
        status: "success",
      });
    } catch (error) {
      return next(new APIError(error.message, status.BAD_REQUEST));
    }
  },
  changePassword: async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;

    let correctPassword = await bcrypt.compare(
      currentPassword,
      req.user.password
    );

    if (correctPassword) {
      const salt = await bcrypt.genSalt(10);
      let password = await bcrypt.hash(newPassword, salt);

      await User.update(
        {
          password,
        },
        {
          where: {
            id: req.user.id,
          },
        }
      );

      res.status(200).send({
        status: "success",
        msg: "Password updated successfully",
      });
    } else {
      res.status(400).send({
        code: 400,
        error: "Current password doesn't match",
      });
    }
  },
  updateProfile: async (req, res, next) => {
    const { username, password, email } = req.body;

    const salt = await bcrypt.genSalt(10);
    let pasword = await bcrypt.hash(password, salt);

    let obj = {};
    // if (username) {
    //   obj.username = username;
    // }
    // if (email) {
    //   obj.email = email;
    // }
    if (password) {
      obj.password = pasword;
    }

    if (password.length < 3) {
      res.status(400).send({
        message: "Password length must be atleast 3 characters.",
      });
    }

    await User.update(obj, {
      where: {
        id: req.user.id,
      },
    });

    res.status(200).send({
      status: "success",
      msg: "Profile updated successfully",
    });
  },
  updateProfilePicture: async (req, res, next) => {
    try {
      let profileImg = "";

      if (req.file != undefined) {
        profileImg = "/uploads/" + req.file.filename;
      }

      profileImg = profileImg.replace("\\", "/");
      profileImg = profileImg.replace("\\", "/");
      profileImg = profileImg.replace("\\", "/");

      let payload = {
        profileImg,
      };

      if (req.body.profileImg) {
        payload = _.omit(payload, ["profileImg"]);
      }

      await User.update(payload, {
        where: {
          id: req.user.id,
        },
      });
      let user = await User.findByPk(req.user.id);

      res.status(200).send({
        status: "success",
        msg: "Profile Picture updated successfully",
        user: user,
      });
    } catch (err) {}
  },
  getListOfGods: async (req, res, next) => {
    try {
      let gods = await God.findAll({});
      res.status(200).send({
        status: "success",
        gods: gods,
      });
    } catch (err) {
      console.log(err);
    }
  },
};

function generatePassword() {
  var length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";

  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }

  return retVal;
}
export default authController;
