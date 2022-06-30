import {User} from "../models/users.js"
import jwt_decode from "jwt-decode";

let authJwt = async (req, res, next) => {
  var token = "";

  if (req.headers.authorization) {
    token = req.headers.authorization.replace("Bearer ", "");

  } else {
    token = req.headers.token
  }

  var decod = jwt_decode(token);
  let name = decod.username;

  // console.log(decoded);
  const user = await User.findOne({
    where: {
      username: name,
    },
  });

  if (!user) {
    res.send({
      code: 400,
      error: "Invalid JWT",
    });

  } else {
    req.user = user;
    next();
  }
};

export { authJwt };
