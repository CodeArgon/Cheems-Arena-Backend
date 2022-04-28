import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { PublicKey } from "@solana/web3.js";
import con from "../config/db.js";

const users = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let { username, email, password, walletAddress } = req.body;

  let pubkey = new PublicKey(walletAddress);
  let isSolana = PublicKey.isOnCurve(pubkey.toBuffer());

  if (!isSolana) {
    res.json({ status: 400, msg: "Invalid Wallet Address" });
  } else {
    function onlyAlphabetsNumbers(username) {
      return /^(?:[a-z0-9]+|\d+)$/.test(username);
    }

    try {
      let result = onlyAlphabetsNumbers(username);
      if (result) {
        // encrypt password
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);

        var sql = `SELECT * FROM users WHERE username = "${username}" OR email = "${email}" OR walletAddress = "${walletAddress}" `;
        con.query(sql, function (err, result) {
          if (err) {
            console.log(err);
          } else {
            if (result.length === 0) {
              var sql = `INSERT INTO users (username, email, password, walletAddress) VALUES ("${username}", "${email}", "${password}", "${walletAddress}")`;
              con.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ status: 200, msg: "Successfully Registered" });
              });
            } else {
              res.json({
                status: 400,
                msg: "Username/Email or Wallet Address already exists",
              });
            }
          }
        });
      } else {
        res.json({
          status: 400,
          msg: "inValid input: No special characters allowed",
        });
      }
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Server Error");
    }
  }
};

export default users;
