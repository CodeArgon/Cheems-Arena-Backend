import sequelize from '../config/db.js'
import { User } from '../models/users.js'
import { MintList } from '../models/mint_list.js'

const syncModelsWithDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Models Sync Succesfully");
  } catch (error) {
    console.log("There is some error in syncing models", error);
  }
};

syncModelsWithDB();
