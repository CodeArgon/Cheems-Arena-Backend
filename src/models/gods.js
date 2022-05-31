import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";

export class God extends Model {}

God.init(
  {
    name: {
      type: DataTypes.TEXT,
    },
    symbol: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "God",
  }
);
