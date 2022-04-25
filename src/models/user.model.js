const { Model, DataTypes } = require("sequelize");
var crypto = require("crypto");
const ForgotPasswordToken = require('../models/forgotPasswordToken.model')
const sequelize = require("../config/db.config");
const jwt = require('jsonwebtoken')


class User extends Model {
  getJWTToken() {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET_KEY)
  }
  static createHashFromString(data) {
    return crypto.createHash('sha256').update(data).digest('hex')
  }

  async generateForgotPasswordToken(user, len) {
    const resetToken = crypto.randomBytes(len).toString('hex')

    const hashedToken = User.createHashFromString(resetToken)

    const expiresIn =
      Date.now() + parseInt(process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN)

    if (this.ForgotPasswordToken) {
      this.ForgotPasswordToken.token = hashedToken
      this.ForgotPasswordToken.expiresIn = expiresIn
      this.ForgotPasswordToken.userId = user
      this.ForgotPasswordToken.save()
    } else {
      await ForgotPasswordToken.create({
        token: hashedToken,
        expiresIn,
        userId: user,
      })
    }

    return resetToken
  }
}

User.init(
  {
    firstName: {
      type: DataTypes.TEXT,
    },
    lastName: {
      type: DataTypes.TEXT,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    country: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    isPasswordAuto: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isActive: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    role: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    age: {
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    profileImg: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    dob: {
      type: DataTypes.DATE,
    }
  },
  {
    sequelize,
    modelName: "User",
  }
);

module.exports = User;
