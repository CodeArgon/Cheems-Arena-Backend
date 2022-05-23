import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { Deck } from "./decks.js";
import { CardModel } from "./cardModels.js";

export class DeckCardModel extends Model {}

DeckCardModel.init(
  {},
  {
    sequelize,
    modelName: "DeckCardModel",
  }
);

DeckCardModel.belongsTo(Deck, {
  onDelete: "CASCADE",
  foreignKey: "deckId",
});

DeckCardModel.belongsTo(CardModel, {
  onDelete: "CASCADE",
  foreignKey: "cardModelId",
});
