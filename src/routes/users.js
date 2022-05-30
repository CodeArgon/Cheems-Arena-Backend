import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { PublicKey } from "@solana/web3.js";
import { Op } from "sequelize";
import { User } from "../models/users.js";
import APIError from "../utils/APIError.js";
import status from "http-status";

const users = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let { username, email, password, walletAddress } = req.body;

  // let pubkey = new PublicKey(walletAddress);
  // let isSolana = PublicKey.isOnCurve(pubkey.toBuffer());

  // if (!isSolana) {
  //   res.json({ status: 400, msg: "Invalid Wallet Address" });
  // } else {
  function onlyAlphabetsNumbers(username) {
    return /^(?:[a-z0-9]+|\d+)$/.test(username);
  }

  try {
    let result = onlyAlphabetsNumbers(username);
    if (result) {
      // encrypt password
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
      let user = await User.findOne({
        where: {
          [Op.or]: [{ username }, { walletAddress }, { email }],
        },
      });
      if (!user) {
        user = await User.create({
          username,
          email,
          password,
          walletAddress,
        });
        res.json({ status: 200, msg: "Successfully Registered" });
      } else {
        throw new Error("Username/Email or Wallet Address already exists");
      }
    } else {
      throw new Error("invalid input: No special characters allowed");
    }
  } catch (error) {
    return next(new APIError(error.message, status.BAD_REQUEST));
  }
  // }
};

export default users;
