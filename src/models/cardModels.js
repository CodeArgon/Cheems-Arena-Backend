import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { User } from "./users.js";
import { Deck } from "./decks.js";

export class CardModel extends Model {}

CardModel.init(
  {
    name: {
      type: DataTypes.TEXT,
    },
    cardImage: {
      type: DataTypes.TEXT,
    },
    description: {
      type: DataTypes.TEXT,
    },
    mana: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    faction: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    rarity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    life: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    strength: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    power: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "CardModel",
  }
);

CardModel.belongsTo(User, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
});
