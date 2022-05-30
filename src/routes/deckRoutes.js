import express from "express";
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
const deckRouter = express.Router();
import { authJwt } from "../middlewares/authJwt.js";

// create a new deck

deckRouter
  .route("/create")
  .post(authJwt, uploadFile.single("profileImg"), deckController.createDeck);

// get all the decks

deckRouter.route("/get-all").get(authJwt, deckController.getAllDecks);

// add a card to the deck

deckRouter
  .route("/:deckId/add-card")
  .post(authJwt, uploadFile.single("profileImg"), deckController.addCardToDeck);

// get all the cards of the deck

deckRouter
  .route("/:deckId/all-cards")
  .get(authJwt, deckController.getAllCardsOfDeck);

// get random four cards of the deck

deckRouter
  .route("/:deckId/random-four-cards")
  .get(authJwt, deckController.getRandomFourCardsOfDeck);

// remove card from the deck

deckRouter
  .route("/:deckId/card/:cardId/delete")
  .delete(authJwt, deckController.deleteCardById);

// get a card from the deck

deckRouter
  .route("/:deckId/card/:cardId")
  .get(authJwt, deckController.getCardById);

export default deckRouter;
