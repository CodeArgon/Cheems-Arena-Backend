import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { User } from "./users.js";
import { DeckCard } from "./deckCards.js";

export class Deck extends Model {}

Deck.init(
  {
    name: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "Deck",
  }
);

Deck.belongsTo(User, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
});

Deck.hasMany(DeckCard, {
  foreignKey: {
    name: "deckId",
    allowNull: false,
  },
});