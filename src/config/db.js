import { Sequelize } from 'sequelize'

const DB_HOST = "localhost"
const DB_USER = "postgres"
const DB_PASSWORD = "123"
const DB_PORT = 5432
const DB_NAME = "chemes"

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  dialect: "postgres",
  host: DB_HOST,
  port: DB_PORT,
});

export default sequelize;
