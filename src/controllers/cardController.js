import status from "http-status";
import { Deck } from "../models/decks.js";
import { DeckCard } from "../models/deckCards.js";
import { CardModel } from "../models/cardModels.js";
import { DeckCardModel } from "../models/deckCardModels.js";

const cardController = {
  createCard: async (req, res, next) => {
    try {
      let {
        user: { id: userId },
        body: {
          name,
          description,
          mana,
          faction,
          rarity,
          life,
          strength,
          power,
        },
      } = req;

      let cardAlreadyExists = await CardModel.findOne({
        where: {
          name: name,
        },
      });

      if (cardAlreadyExists) {
        res.status(400).send({
          message: "This card already exists",
        });
      } else {
        let card = await CardModel.create({
          userId: userId,
          name: name,
          description: description,
          mana,
          faction,
          rarity,
          life,
          strength,
          power,
        });

        res.status(status.CREATED).json({
          status: "success",
          card: card,
        });
      }
    } catch (err) {}
  },
  addCardModelToDeck: async (req, res, next) => {
    try {
      let {
        params: { deckId },
        user: { id: userId },
        body: { cardModelId },
      } = req;

      let deck = await Deck.findOne({
        where: { id: deckId },
      });
      deckId = parseInt(deckId);

      if (deck.userId !== userId) {
        res.status(400).send({
          message: "You do not hold this deck",
        });
      } else {
        let existingCardsLength = await DeckCardModel.count({
          where: {
            deckId: deckId,
          },
        });

        if (existingCardsLength >= 30) {
          res.status(400).send({
            message: "You have reached the total limit of this deck",
          });
        } else {
          let cardExists = await DeckCardModel.findOne({
            where: {
              deckId: deckId,
              cardModelId: cardModelId,
            },
          });
          if (cardExists) {
            res.status(400).send({
              message: "This card already exists in the deck.",
            });
          } else {
            await DeckCardModel.create({
              userId: userId,
              deckId: deckId,
              cardModelId: cardModelId,
            });

            let deckWithCards = await Deck.findOne({
              where: { id: deckId },
              include: [
                {
                  model: DeckCardModel,
                },
              ],
            });

            res.status(status.CREATED).json({
              status: "success",
              deck: deckWithCards,
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  },
};

export default cardController;
