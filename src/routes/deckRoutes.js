import express from "express"
import deckController from "../controllers/deckController.js";


import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Data is here", file);
    cb(null, "src/uploads/userprofile");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
});
const userProfileRouter = express.Router();
import {authJwt} from "../middlewares/authJwt.js";

userProfileRouter.route("/create").post(authJwt, uploadFile.single("profileImg"),deckController.createDeck);

export default userProfileRouter