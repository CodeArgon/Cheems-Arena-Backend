import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

export class ForgotPasswordToken extends Model { }

ForgotPasswordToken.init(
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
        modelName: 'ForgotPasswordToken',
    }
);

