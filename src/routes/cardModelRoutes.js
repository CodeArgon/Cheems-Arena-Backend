import express from "express";
import cardController from "../controllers/cardController.js";

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
const cardModelRoutes = express.Router();

export default cardModelRoutes;

cardModelRoutes
  .route("/create-card")
  .post(authJwt, uploadFile.single("profileImg"), cardController.createCard);

cardModelRoutes
  .route("/addCardModelToDeck/:deckId")
  .post(authJwt, uploadFile.single("profileImg"), cardController.addCardModelToDeck);
import { authJwt } from "../middlewares/authJwt.js";
