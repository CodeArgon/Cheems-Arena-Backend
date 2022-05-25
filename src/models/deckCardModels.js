import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { Deck } from "./decks.js";
import { CardModel } from "./cardModels.js";
import { User } from "./users.js";

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

DeckCardModel.belongsTo(User, {
  onDelete: "CASCADE",
  foreignKey: "userId",
});
