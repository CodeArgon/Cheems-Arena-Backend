import status from "http-status";
import { sendForgotPasswordEmail } from "../utils/sendEmail.js";
import { ForgotPasswordToken } from "../models/forgotPasswordToken.js";
import { User } from "../models/users.js";
import bcrypt from 'bcryptjs'

const authController = {
  forgotPassword: async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({
      where: {
        email,
      },
      include: [ForgotPasswordToken],
    });
    if (!user) {
      res.status(400).send({
        message: "No User found with the email address",
      });
    } else {
      let code = generatePassword();
      const subject = "Forgot Password";
      const salt = await bcrypt.genSalt(10);
      const  password = await bcrypt.hash(code, salt);
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
  },
  changePassword: async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    let correctPassword = await bcrypt.compare(currentPassword, req.user.password);

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
      res.send({
        "code": 400,
        "error": "Current password doesn't match"
    })
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