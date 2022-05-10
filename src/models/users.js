import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { ForgotPasswordToken } from "./forgotPasswordToken.js";
import crypto from 'crypto'

export class User extends Model {
  static createHashFromString(data) {
    return crypto.createHash("sha256").update(data).digest("hex");
  }
  async generateForgotPasswordToken(user, len) {
    // const resetToken = crypto.randomBytes(len).toString('hex')
    const resetToken = Math.floor(1000 + Math.random() * 9000).toString();
    const hashedToken = User.createHashFromString(resetToken);

    const expiresIn =
      Date.now() + parseInt(process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN);

    if (this.ForgotPasswordToken) {
      this.ForgotPasswordToken.token = hashedToken;
      this.ForgotPasswordToken.expiresIn = expiresIn;
      this.ForgotPasswordToken.userId = user;
      this.ForgotPasswordToken.save();
    } else {
      await ForgotPasswordToken.create({
        token: hashedToken,
        expiresIn,
        userId: user,
      });
    }

    return resetToken;
  }
}

User.init(
  {
    username: {
      type: DataTypes.TEXT,
    },
    email: {
      type: DataTypes.TEXT,
    },
    password: {
      type: DataTypes.TEXT,
    },
    walletAddress: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "User",
  }
);

User.hasOne(ForgotPasswordToken, {
  onDelete: "CASCADE",
  foreignKey: "userId",
});