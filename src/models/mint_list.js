import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

export class MintList extends Model { }

MintList.init(
    {
        mint: {
            type: DataTypes.TEXT,
        },
    },
    {
        sequelize,
        modelName: 'MintList',
    }
);
