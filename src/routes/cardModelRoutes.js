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

// create a new card

cardModelRoutes
  .route("/create-card")
  .post(authJwt, uploadFile.single("profileImg"), cardController.createCard);

// add card to the deck
cardModelRoutes
  .route("/addCardModelToDeck/:deckId")
  .post(
    authJwt,
    uploadFile.single("profileImg"),
    cardController.addCardModelToDeck
  );

cardModelRoutes
  .route("/json")
  .get(authJwt, cardController.getAllCardsFromJson);

//get all cards from the db
cardModelRoutes
  .route("/all")
  .get(authJwt, cardController.getAllCardsFromDatabase);

//get all cards from the deck
cardModelRoutes
  .route("/getAllCardModelOfDeck/:deckId")
  .get(authJwt, cardController.getAllCardModelOfDeck);

//get four cards from the deck
cardModelRoutes
  .route("/getFourRadomCardModelOfDeck/:deckId")
  .get(authJwt, cardController.getFourRadomCardModelOfDeck);

//remove card from the deck
cardModelRoutes
  .route("/:cardModelId/deleteCardModelOfDeck/:deckId")
  .delete(authJwt, cardController.deleteCardFromDeck);

//get a specific card from the deck
cardModelRoutes
  .route("/:cardModelId/get/:deckId")
  .get(authJwt, cardController.getSpecificCardFromDeck);

// delete all cards
cardModelRoutes
  .route("/delete")
  .delete(cardController.deleteAllCardsFromDatabase);

import { authJwt } from "../middlewares/authJwt.js";
