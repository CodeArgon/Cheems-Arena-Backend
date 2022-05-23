import status from "http-status";
import { Deck } from "../models/decks.js";
import { DeckCard } from "../models/deckCards.js";
import _ from "lodash";

const deckController = {
  createDeck: async (req, res, next) => {
    try {
      if (req.body.name) {
        let deckExistsWithThisName = await Deck.findOne({
          where: {
            name: req.body.name,
            userId: req.user.id,
          },
        });

        if (deckExistsWithThisName) {
          res.status(400).send({
            message: "Please choose the other name for the deck",
          });
        } else {
          let deck = await Deck.create({
            name: req.body.name,
            userId: req.user.id,
          });

          res.status(status.CREATED).json({
            status: "success",
            deck: deck,
          });
        }
      } else {
        res.status(400).send({
          message: "Please specify the name for the deck",
        });
      }
    } catch (err) {}
  },
  addCardToDeck: async (req, res, next) => {
    try {
      let {
        params: { deckId },
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

      let deck = await Deck.findOne({
        where: { id: deckId },
      });

      if (deck.userId !== userId) {
        res.status(400).send({
          message: "You do not hold this deck",
        });
      } else {
        let existingCardsLength = await DeckCard.count({
          where: {
            deckId: deckId,
          },
        });

        if (existingCardsLength >= 30) {
          res.status(400).send({
            message: "You have reached the total limit of this deck",
          });
        } else {
          let cardExists = await DeckCard.findOne({
            where: {
              deckId: deckId,
              name: name,
            },
          });
          if (cardExists) {
            res.status(400).send({
              message: "This card already exists in the deck.",
            });
          } else {
            await DeckCard.create({
              userId: userId,
              deckId: deckId,
              name: name,
              description: description,
              mana,
              faction,
              rarity,
              life,
              strength,
              power,
            });

            let deckWithCards = await Deck.findOne({
              where: { id: deckId },
              include: [
                {
                  model: DeckCard,
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
    } catch (error) {}
  },
  getAllCardsOfDeck: async (req, res, next) => {
    try {
      let {
        params: { deckId },
      } = req;

      let deckWithCards = await Deck.findOne({
        where: { id: deckId },
        include: [
          {
            model: DeckCard,
          },
        ],
      });

      res.status(200).json({
        status: "success",
        deck: deckWithCards,
      });
    } catch (err) {}
  },
  deleteCardById: async (req, res, next) => {
    try {
      let {
        params: { deckId, cardId },
      } = req;

      let card = await DeckCard.findOne({
        where: {
          id: cardId,
          deckId: deckId,
        },
      });

      if (!card) {
        res.status(400).send({
          message: "Card not found in the deck",
        });
      } else {
        await DeckCard.destroy({
          where: {
            id: cardId,
            deckId: deckId,
          },
        });

        res.status(200).json({
          status: "success",
          msg: "Card deleted successfully.",
        });
      }
    } catch (err) {}
  },
  getCardById: async (req, res, next) => {
    try {
      let {
        params: { deckId, cardId },
      } = req;

      let card = await DeckCard.findOne({
        where: {
          id: cardId,
          deckId: deckId,
        },
      });

      if (!card) {
        res.status(400).send({
          message: "Card not found in the deck",
        });
      } else {
        res.status(200).json({
          status: "success",
          card: card,
        });
      }
    } catch (err) {}
  },
  getAllDecks: async (req, res, next) => {
    try {
      let {
        user: { id: userId },
      } = req;

      let decks = await Deck.findAll({
        where: {
          userId: userId,
        },
      });
      res.status(200).json({
        status: "success",
        decks: decks,
      });
    } catch (err) {}
  },
  getRandomFourCardsOfDeck: async (req, res, next) => {
    try {
      let {
        params: { deckId },
      } = req;

      let deckWithCards = await Deck.findOne({
        where: { id: deckId },
        include: [
          {
            model: DeckCard,
          },
        ],
      });

      const randomFourCards = _.sampleSize(deckWithCards.DeckCards, 4);
      deckWithCards.dataValues.randomFourCards = randomFourCards;

      res.status(200).json({
        status: "success",
        randomFourCards: randomFourCards,
      });
    } catch (err) {}
  },
};

export default deckController;
