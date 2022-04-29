import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

export class User extends Model { }

User.init(
    {
        username: {
            type: DataTypes.TEXT,
        },
        email: {
            type: DataTypes.TEXT,
        },
        password: {
            type: DataTypes.TEXT,
        },
        walletAddress: {
            type: DataTypes.TEXT
        },
    },
    {
        sequelize,
        modelName: 'User',
    }
);

