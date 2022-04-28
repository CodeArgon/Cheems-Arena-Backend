const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const generator = require("generate-password");
const { Op } = require("sequelize");
const { validateEmail } = require("../utils/validateEmail");
const ForgotPasswordToken = require("../models/forgotPasswordToken.model");
const { sendEmail, sendForgotPasswordEmail } = require("../utils/sendEmail");
const APIError = require("../utils/APIError.js");
const sequelize = require("sequelize");
const status = require("http-status");
const { PublicKey } = require("@solana/web3.js");

exports.register = async (req, res) => {
  let {
    walletAddress,
    userName,
    email,
    phone,
    country,
    city,
    gender,
    age,
    password,
    dob,
  } = req.body;
  let profileImg = "";
  if (req.file != undefined) {
    profileImg = req.file.path;
  }
  let sendMail = false;
  if (password == undefined) {
    password = generator.generate({
      length: 10,
      numbers: true,
    });
    sendMail = true;
  }
  try {
    let pubkey = new PublicKey(walletAddress);
    let isSolana = PublicKey.isOnCurve(pubkey.toBuffer());

    if (!isSolana) {
      res.json({ status: 400, msg: "Invalid Wallet Address" });
    }
    const user = await User.create({
      userName,
      walletAddress,
      email,
      phone,
      country,
      city,
      gender,
      age,
      profileImg: profileImg,
      password: bcrypt.hashSync(password, 8),
      dob,
    });
    if (sendMail == true) {
      user.isPasswordAuto = true;
      user.save();
      sendEmail(email, "One Time Password", password);
    }
    res.status(200).send({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    req.body.phone = req.body.phone == undefined ? "" : req.body.phone;
    const user = await User.findOne({
      attributes: [
        "id",
        "userName",
        "walletAddress",
        "password",
        "email",
        "role",
        "profileImg",
      ],
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(404).send({ message: "Incorrect Email Or Password!" });
    }
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Incorrect Email Or Password!",
      });
    }
    var token = user.getJWTToken();

    res.status(200).send({
      user: user,
      accessToken: token,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({
    where: {
      email,
    },
    include: [ForgotPasswordToken],
  });
  if (!user)
    return next(
      new APIError("No User found with the email address", status.BAD_REQUEST)
    );

  const token = await user.generateForgotPasswordToken(user.id, 2);
  const subject = "Forgot Password";

  sendForgotPasswordEmail(user.email, subject, token);

  res.status(status.CREATED).json({
    status: "success",
    reset_token: token,
  });
};

exports.resetPassword = async (req, res, next) => {
  const { email, password, token } = req.body;

  const hashedToken = User.createHashFromString(token);

  const user = await User.findOne({
    include: [
      {
        model: ForgotPasswordToken,
        where: {
          token: hashedToken,
          expiresIn: {
            [Op.gte]: Date.now(),
          },
        },
      },
    ],
  });

  if (!user)
    return next(
      new APIError("Your session has been expired!", status.UNAUTHORIZED)
    );

  user.password = bcrypt.hashSync(password, 8);
  await user.ForgotPasswordToken.destroy();

  await user.save();

  res.status(status.OK).json({
    status: "success",
  });
};

exports.makeRangeIterator = async (req, res, next) => {
  try {
    const sequence = fibonacci();
    console.log(sequence.next().value); // 0
    console.log(sequence.next().value); // 1
    console.log(sequence.next().value); // 1
    console.log(sequence.next().value); // 2
    console.log(sequence.next().value); // 3
    console.log(sequence.next().value); // 5
    console.log(sequence.next().value); // 8
    console.log(sequence.next(true).value); // 0
    console.log(sequence.next().value); // 1
    console.log(sequence.next().value); // 1
    console.log(sequence.next().value); // 2
    // const it = makeRangeIterator(1, 10, 2);

    // let result = it.next();
    // while (!result.done) {
    //  console.log(result.value); // 1 3 5 7 9
    //  result = it.next();
    // }
    // res.status(status.OK).json({
    //   status: result.value,
    // })
    // console.log("Iterated over sequence of size: ", result.value);
  } catch (err) {
    console.log(err);
  }
};

// function makeRangeIterator(start = 0, end = Infinity, step = 1) {
//   let nextIndex = start;
//   let iterationCount = 0;

//   const rangeIterator = {
//      next: function() {
//          let result;
//          if (nextIndex < end) {
//              result = { value: nextIndex, done: false }
//              nextIndex += step;
//              iterationCount++;
//              return result;
//          }
//          return { value: iterationCount, done: true }
//      }
//   };
//   return rangeIterator;
// }

function* makeRangeIterator(start = 0, end = 100, step = 1) {
  let iterationCount = 0;
  for (let i = start; i < end; i += step) {
    iterationCount++;
    yield i;
  }
  return iterationCount;
}

function* fibonacci() {
  let current = 0;
  let next = 1;
  while (true) {
    let reset = yield current;
    [current, next] = [next, next + current];
    if (reset) {
      current = 0;
      next = 1;
    }
  }
}
