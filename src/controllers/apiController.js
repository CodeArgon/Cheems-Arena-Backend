import tokenController from "./tokenController.js";
import con from '../config/db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from "../models/users.js";
import { CardModel } from "../models/cardModels.js";

const apiController = {
  getTokens: async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    const user = await User.findOne({
      where: {
        username
      }
    })

    if (!user) {
      res.status(400).send({
        "code": 400,
        "error": "Username or password are incorrect"
      })

    } else {
      let pubKey = user.walletAddress

      // compare passwords [ from db and users input ]
      let comparison = await bcrypt.compare(password, user.password).then()

      if (comparison) {
        if (!pubKey) {
          return res.status(400).json({ message: "Error. Please connect wallet and send pubKey to verify." });
        }

        const payload = {
          username,
          password
        };

        const token = jwt.sign(
          payload,
          "thisissecretkey",
          { expiresIn: '1 day' },
        );
        // get metadata against public key
        // let metaDataArray = await tokenController.getMetaData(pubKey);
        let cards = await CardModel.findAll();

        let metaDataArray = cards.map(function (currentValue, Index) {

          currentValue.dataValues.INDEX = Index + 1
          let manValue = currentValue.dataValues.mana ? currentValue.dataValues.mana.toString() : currentValue.dataValues.mana;
          let attackValue = currentValue.dataValues.attack ? currentValue.dataValues.attack.toString() : currentValue.dataValues.attack;
          let hpValue = currentValue.dataValues.hp ? currentValue.dataValues.hp.toString() : currentValue.dataValues.hp

          currentValue.dataValues.attributes = [
            {
              "trait_type": "Mana",
              "value": manValue
            },
            {
              "trait_type": "Attack",
              "value": attackValue
            },
            {
              "trait_type": "Hp",
              "value": hpValue
            },
            {
              "trait_type": "Specification",
              "value": currentValue.dataValues.specification
            },
            {
              "trait_type": "Rarity",
              "value": currentValue.dataValues.rarity
            }
          ]

          currentValue.dataValues.collection = {
            "name": "Cheems Arena",
            "family": "Cheems"
          }

          currentValue.dataValues.seller_fee_basis_points = 400
          return currentValue
        })

        let response = {
          LoginDataRoot: {
            pubKey,
            data: metaDataArray,
            message: "Token metaData found in user wallet.",
            token,
            username: user.username,
            email: user.email,
            walletAddress: user.walletAddress,
            profileImg: user.profileImg,
          },
        };
        res.json(response);
      } else {
        res.status(400).send({
          "code": 400,
          "error": "Username or password doesn't match"
        })
      }
    }

  }
}

export default apiController;