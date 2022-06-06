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
    cardType: {
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
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rarity: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    life: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    strength: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    power: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "CardModel",
  }
);

// CardModel.belongsTo(User, {
//   foreignKey: {
//     name: "userId",
//     allowNull: false,
//   },
// });
