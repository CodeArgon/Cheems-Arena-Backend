import status from "http-status";
import { User } from "../models/users.js";
import { Deck } from "../models/decks.js";

const deckController = {
  createDeck: async (req, res, next) => {
    try {
      if (req.body.name) {
        let deck = await Deck.create({
          name: req.body.name,
          userId: req.user.id,
        } );

        res.status(status.CREATED).json({
          status: "success",
          deck: deck,
        });
      } else {
        res.status(400).send({
          message: "Please specify the name for the deck",
        });
      }
    } catch (err) {}
  },
};

export default deckController;
