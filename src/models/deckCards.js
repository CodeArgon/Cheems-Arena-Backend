import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { Deck } from "./decks.js";
import { User } from "./users.js";

export class DeckCard extends Model {}

DeckCard.init(
  {
    name: {
      type: DataTypes.TEXT,
    },
    cardImage: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "DeckCard",
  }
);

DeckCard.belongsTo(User, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
});

DeckCard.belongsTo(Deck, {
  foreignKey: {
    name: "deckId",
    allowNull: false,
  },
});
