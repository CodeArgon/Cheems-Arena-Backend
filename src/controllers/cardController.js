import status from "http-status";
import { Deck } from "../models/decks.js";
import { DeckCard } from "../models/deckCards.js";
import { CardModel } from "../models/cardModels.js";
import { DeckCardModel } from "../models/deckCardModels.js";
import _ from "lodash";

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
  getAllCardModelOfDeck: async (req, res, next) => {
    try {
      let {
        params: { deckId },
        user: { id: userId },
      } = req;

      let deckWithCards = await Deck.findOne({
        where: { id: deckId },
        include: [
          {
            model: DeckCardModel,
            include: [{ model: CardModel }],
          },
        ],
      });

      res.status(status.OK).json({
        status: "success",
        deck: deckWithCards,
      });
    } catch (err) {
      console.log(err);
    }
  },
  deleteCardFromDeck: async (req, res, next) => {
    try {
      let {
        params: { deckId, cardModelId },
        user: { id: userId },
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
        let cardExists = await DeckCardModel.findOne({
          where: {
            deckId: deckId,
            cardModelId: cardModelId,
            userId: userId,
          },
        });
        if (!cardExists) {
          res.status(400).send({
            message: "This card does not exist in the deck.",
          });
        } else {
          await DeckCardModel.destroy({
            where: {
              deckId: deckId,
              cardModelId: cardModelId,
              userId: userId,
            },
          });
        }
        res.status(status.OK).json({
          status: "success",
        });
      }
    } catch (error) {}
  },
  getSpecificCardFromDeck: async (req, res, next) => {
    try {
      let {
        params: { deckId, cardModelId },
        user: { id: userId },
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
        let cardExists = await DeckCardModel.findOne({
          where: {
            deckId: deckId,
            cardModelId: cardModelId,
            userId: userId,
          },
          include: [{ model: CardModel }],
        });
        if (!cardExists) {
          res.status(400).send({
            message: "This card does not exist in the deck.",
          });
        } else {
          res.status(status.OK).json({
            status: "success",
            card: cardExists,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  },
  getFourRadomCardModelOfDeck: async (req, res, next) => {
    try {
      let {
        params: { deckId },
        user: { id: userId },
      } = req;

      let deckWithCards = await Deck.findOne({
        where: { id: deckId },
        include: [
          {
            model: DeckCardModel,
            include: [{ model: CardModel }],
          },
        ],
      });

      const randomFourCards = _.sampleSize(deckWithCards.DeckCardModels, 4);

      res.status(status.OK).json({
        status: "success",
        deck: randomFourCards,
      });
    } catch (err) {
      console.log(err);
    }
  },
};

export default cardController;
