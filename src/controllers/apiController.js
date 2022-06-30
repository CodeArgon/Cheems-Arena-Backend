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

          currentValue.dataValues.cardProps = [
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
            },
            {
              "trait_type": "Faction",
              "value": currentValue.dataValues.faction
            }
          ]

          currentValue.dataValues.collection = {
            "name": "Cheems Arena",
            "family": "Cheems"
          }

          currentValue.dataValues.seller_fee_basis_points = 400
          delete currentValue.dataValues['mana'];
          delete currentValue.dataValues['specification'];
          delete currentValue.dataValues['attack'];
          delete currentValue.dataValues['hp'];
          delete currentValue.dataValues['faction'];
          delete currentValue.dataValues['rarity'];
          delete currentValue.dataValues['life'];
          delete currentValue.dataValues['strength'];
          delete currentValue.dataValues['power'];
          delete currentValue.dataValues['updatedAt'];
          delete currentValue.dataValues['createdAt'];
          delete currentValue.dataValues['INDEX'];
          delete currentValue.dataValues['id'];

          return currentValue
        })

        let response = {
          LoginDataRoot: {
            pubKey,
            data: cardLibraryJSON,
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

  },
  carddata: async (req, res) => {
    res.json(cardLibraryJSON);
  }
}

export default apiController;


let cardLibraryJSON = [
  {
      "name": "Set 1",
      "cards": [
          {
              "cardTypeId": 0,
              "name": "Ponzi King",
              "costs": [
                  {
                      "statId": 1,
                      "value": 5,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Reduce the mana of a random card by 1.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Evil",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 2,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 3,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 3,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
              "keywords": [
                  {
                      "keywordId": 0,
                      "valueId": 0
                  }
              ],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Deal 1 damage",
                      "type": "Triggered",
                      "effect": {
                          "value": {
                              "constant": 1,
                              "$type": "CCGKit.ConstantValue"
                          },
                          "duration": 0,
                          "statId": 1,
                          "gameZoneId": 2,
                          "cardTypeId": 0,
                          "$type": "CCGKit.DecreaseCardStatEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.OpponentCard"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 0
          },
          {
              "cardTypeId": 0,
              "name": "Bogdragon",
              "costs": [
                  {
                      "statId": 1,
                      "value": 6,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Deal 1 damage to all of the opponent minions.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 5,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 5,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 10,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 10,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
              "keywords": [ {
                  "keywordId": 0,
                  "valueId": 1
              }],
              "abilities": [],
              "id": 1
          },
          {
              "cardTypeId": 0,
              "name": "Howling Wizard",
              "costs": [
                  {
                      "statId": 1,
                      "value": 6,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Taunt",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Magic",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 5,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 5,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 10,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 10,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
              "keywords": [ {
                  "keywordId": 0,
                  "valueId": 2
              }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Add +1 attack",
                      "type": "Triggered",
                      "effect": {
                          "value": {
                              "constant": 1,
                              "$type": "CCGKit.ConstantValue"
                          },
                          "duration": 1,
                          "statId": 0,
                          "gameZoneId": 2,
                          "cardTypeId": 0,
                          "$type": "CCGKit.IncreaseCardStatEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.AllPlayerCards"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 2
          },
          {
              "cardTypeId": 0,
              "name": "Amchor the Alpinist",
              "costs": [
                  {
                      "statId": 1,
                      "value": 6,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Add 2 attack points to one minion.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Citizen",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 2,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 5,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 5,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
              "keywords": [ {
                  "keywordId": 0,
                  "valueId": 2
              }],
              "abilities": [],
              "id": 3
          },
          {
              "cardTypeId": 0,
              "name": "Cheemsatoshi",
              "costs": [
                  {
                      "statId": 1,
                      "value": 7,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Draw a card.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Magic",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 7,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 7,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 7,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 7,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
              "keywords": [ {
                  "keywordId": 0,
                  "valueId": 1
              }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 4
          },

          {
              "cardTypeId": 0,
              "name": "Tabzen the Tyrant",
              "costs": [
                  {
                      "statId": 1,
                      "value": 7,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Destroy a random opponent minion.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Evil",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 7,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 7,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 5,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 5,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
              "keywords": [ {
                  "keywordId": 0,
                  "valueId": 1
              }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 5
          },
          

          {
              "cardTypeId": 0,
              "name": "Kermit the Degen",
              "costs": [
                  {
                      "statId": 1,
                      "value": 7,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Freeze a random opponent minion for 2 turns.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Magic",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 7,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 7,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 5,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 5,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
              "keywords": [ {
                  "keywordId": 0,
                  "valueId": 1
              }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 6
          },



          {
              "cardTypeId": 0,
              "name": "Melon Piggo",
              "costs": [
                  {
                      "statId": 1,
                      "value": 7,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Deal 1 damage to all of the opponent minions and 3 to their god.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 7,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 7,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 5,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 5,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
              "keywords": [ {
                  "keywordId": 0,
                  "valueId": 1
              }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 7
          },



          {
              "cardTypeId": 0,
              "name": "Natzuko the Assassin",
              "costs": [
                  {
                      "statId": 1,
                      "value": 7,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Your god gains +3 HP and a random card is added into your hand.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Evil",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 7,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 7,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 5,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 5,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
              "keywords": [ {
                  "keywordId": 0,
                  "valueId": 1
              }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 8
          },


          {
              "cardTypeId": 0,
              "name": "Firecrab",
              "costs": [
                  {
                      "statId": 1,
                      "value": 2,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Draw a card.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 1,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 1,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 1,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 1,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
              "keywords": [ {
                  "keywordId": 0,
                  "valueId": 0
              }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 9
          },


          {
              "cardTypeId": 0,
              "name": "Dogegorgon",
              "costs": [
                  {
                      "statId": 1,
                      "value": 4,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Draw a card.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Evil",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 5,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 5,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 2,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
              "keywords": [ {
                  "keywordId": 0,
                  "valueId": 2
              }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 10
          },



          {
              "cardTypeId": 0,
              "name": "Pyramid Cheem",
              "costs": [
                  {
                      "statId": 1,
                      "value": 5,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "-1 HP to a random opponents minion each turn.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Neutral",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 2,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 1,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 1,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
              "keywords": [ {
                  "keywordId": 0,
                  "valueId": 3
              }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 11
          },



          {
              "cardTypeId": 0,
              "name": "Boxer the Warrior",
              "costs": [
                  {
                      "statId": 1,
                      "value": 3,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Opponent is unable to attack their next turn.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Citizen",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 3,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 3,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 3,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 3,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
              "keywords": [ {
                  "keywordId": 0,
                  "valueId": 2
              }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 12
          },


          {
              "cardTypeId": 0,
              "name": "Avalanche Shyeti",
              "costs": [
                  {
                      "statId": 1,
                      "value": 1,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Oppenent has a 30% chance to miss their attack.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 1,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 1,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 1,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 1,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
              "keywords": [ {
                  "keywordId": 0,
                  "valueId": 0
              }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 13
          },



          {
              "cardTypeId": 0,
              "name": "Master Shibineer",
              "costs": [
                  {
                      "statId": 1,
                      "value": 1,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Deal 1 damage to an enemy creature.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Citizen",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 2,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 2,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
              "keywords": [ {
                  "keywordId": 0,
                  "valueId": 3
              }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 14
          },

          {
              "cardTypeId": 0,
              "name": "Fiksu the Archeress",
              "costs": [
                  {
                      "statId": 1,
                      "value": 3,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Upon death, 1 damage is dealt to all opponent minions.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Citizen",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 3,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 3,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 1,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 1,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
              "keywords": [ {
                  "keywordId": 0,
                  "valueId": 2
              }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 15
          },


          {
              "cardTypeId": 0,
              "name": "Magma Shibdozer",
              "costs": [
                  {
                      "statId": 1,
                      "value": 1,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Taunt.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 2,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 2,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
              "keywords": [ {
                  "keywordId": 0,
                  "valueId": 0
              }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 16
          },


          {
              "cardTypeId": 0,
              "name": "Bonk",
              "costs": [
                  {
                      "statId": 1,
                      "value": 7,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Whenever Bonk takes damage, double its attack.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Neutral",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 4,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 4,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 9,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 9,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
              "keywords": [ {
                  "keywordId": 0,
                  "valueId": 3
              }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 17
          },



          {
              "cardTypeId": 0,
              "name": "Merchant Cheemsy",
              "costs": [
                  {
                      "statId": 1,
                      "value": 5,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Draw 2 cards.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Citizen",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 2,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 2,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
              "keywords": [ {
                  "keywordId": 0,
                  "valueId": 0
              }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 18
          },

          {
              "cardTypeId": 0,
              "name": "Mystic Spy",
              "costs": [
                  {
                      "statId": 1,
                      "value": 3,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "-2 HP to all opponent minions.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Evil",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 2,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 1,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 1,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
              "keywords": [ {
                  "keywordId": 0,
                  "valueId": 2
              }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 19
          },




          {
              "cardTypeId": 0,
              "name": "Borg Hound",
              "costs": [
                  {
                      "statId": 1,
                      "value": 1,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Upon death, a random card is added into your hand.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Magic",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 1,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 1,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 2,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
              "keywords": [ {
                  "keywordId": 0,
                  "valueId": 3
              }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 20
          },






          {
              "cardTypeId": 0,
              "name": "Degenape",
              "costs": [
                  {
                      "statId": 1,
                      "value": 2,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Whenever a friendly minion dies, this creature gets +1 attack.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 2,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 2,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
              "keywords": [ {
                  "keywordId": 0,
                  "valueId": 3
              }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 21
          },



          {
              "cardTypeId": 0,
              "name": "Degenape",
              "costs": [
                  {
                      "statId": 1,
                      "value": 2,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Whenever a friendly minion dies, this creature gets +1 attack.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Magic",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 2,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 2,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
              "keywords": [ {
                  "keywordId": 0,
                  "valueId": 3
              }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 22
          },



          {
              "cardTypeId": 0,
              "name": "Karma the Enchanted",
              "costs": [
                  {
                      "statId": 1,
                      "value": 1,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Give +2 HP to your god.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Magic",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 2,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 2,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
              "keywords": [ {
                  "keywordId": 0,
                  "valueId": 0
              }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 23
          },



          {
              "cardTypeId": 0,
              "name": "Ragnar the Hacker",
              "costs": [
                  {
                      "statId": 1,
                      "value": 2,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Give +1 HP to a random minion.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Magic",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 2,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 2,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
              "keywords": [ {
                  "keywordId": 0,
                  "valueId": 0
              }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 24
          },







          {
              "cardTypeId": 0,
              "name": "Composability God",
              "costs": [
                  {
                      "statId": 1,
                      "value": 5,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "One-hit kill Boxer the Warrior.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Magic",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 3,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 3,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 6,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 6,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
              "keywords": [ {
                  "keywordId": 0,
                  "valueId": 3
              }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 25
          },





          {
              "cardTypeId": 0,
              "name": "Bonk Whale",
              "costs": [
                  {
                      "statId": 1,
                      "value": 7,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Whenever your enemy plays a spell, 2 cards are added to your hand.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 5,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 5,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 7,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 7,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
              "keywords": [ {
                  "keywordId": 0,
                  "valueId": 1
              }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 26
          },




          {
              "cardTypeId": 0,
              "name": "Ape Warrior",
              "costs": [
                  {
                      "statId": 1,
                      "value": 3,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Destroy a friendly minion and add its stats to this card.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 3,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 3,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 3,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 3,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 3
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 27
          },




          {
              "cardTypeId": 0,
              "name": "Sir Knight Cheemsy",
              "costs": [
                  {
                      "statId": 1,
                      "value": 8,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Whenever your god takes damage, deal 2 damage to each opponent creature.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Citizen",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 2,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 11,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 11,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 0
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 28
          },



          {
              "cardTypeId": 0,
              "name": "Maximus Cheemsius II",
              "costs": [
                  {
                      "statId": 1,
                      "value": 3,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Give +1 HP to a friendly minion.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Citizen",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 2,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 3,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 3,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 0
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 29
          },





          {
              "cardTypeId": 0,
              "name": "Old Farmer Cheemsy",
              "costs": [
                  {
                      "statId": 1,
                      "value": 1,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Draw a card.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Citizen",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 1,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 1,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 1,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 1,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 0
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 30
          },





          {
              "cardTypeId": 0,
              "name": "Baby Cheems",
              "costs": [
                  {
                      "statId": 1,
                      "value": 1,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "After each round, +2 HP is added to an injured friendly minion.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Neutral",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 1,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 1,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 2,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 0
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 31
          },





          {
              "cardTypeId": 0,
              "name": "Enchanted Inucorn",
              "costs": [
                  {
                      "statId": 1,
                      "value": 1,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Upon death, a random card is added into your hand.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Magic",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 1,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 1,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 1,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 1,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 0
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 32
          },




          {
              "cardTypeId": 0,
              "name": "Duke the Investor",
              "costs": [
                  {
                      "statId": 1,
                      "value": 2,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Draw a card.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Citizen",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 2,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 2,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 0
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 33
          },




          {
              "cardTypeId": 0,
              "name": "Dungeon Shiborc",
              "costs": [
                  {
                      "statId": 1,
                      "value": 2,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Reduce the mana of a random card by 2.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Evil",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 1,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 1,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 3,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 3,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 0
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 34
          },







          {
              "cardTypeId": 0,
              "name": "Water Shibagician",
              "costs": [
                  {
                      "statId": 1,
                      "value": 2,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Upon death, 2 random cards are added into each players hand.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Magic",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 1,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 1,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 1,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 1,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 0
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 35
          },





          {
              "cardTypeId": 0,
              "name": "Cryptographer",
              "costs": [
                  {
                      "statId": 1,
                      "value": 2,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Whenever your enemy plays a spell, this minion will gain +1 HP.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Citizen",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 2,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 3,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 3,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 0
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 36
          },




          {
              "cardTypeId": 0,
              "name": "Monkey King ",
              "costs": [
                  {
                      "statId": 1,
                      "value": 2,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Taunt",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 2,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 3,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 3,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 0
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 37
          },






          {
              "cardTypeId": 0,
              "name": "Angry Beak",
              "costs": [
                  {
                      "statId": 1,
                      "value": 2,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Shield",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 2,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 2,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 0
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 38
          },



          {
              "cardTypeId": 0,
              "name": "Zen Master Cheemsy",
              "costs": [
                  {
                      "statId": 1,
                      "value": 3,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Lightning",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Magic",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 2,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 1,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 1,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 0
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 39
          },




          {
              "cardTypeId": 0,
              "name": "Desert Sphinx",
              "costs": [
                  {
                      "statId": 1,
                      "value": 3,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Upon death, a random card is added into your hand.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 3,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 3,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 2,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 0
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 40
          },







          {
              "cardTypeId": 0,
              "name": "Dash the Courier",
              "costs": [
                  {
                      "statId": 1,
                      "value": 3,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "-1 HP to all opponent minions.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Citizen",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 2,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 1,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 1,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 0
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 41
          },




          {
              "cardTypeId": 0,
              "name": "Jungle Shibsplorer",
              "costs": [
                  {
                      "statId": 1,
                      "value": 3,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Upon death, a random card is added into your hand.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Citizen",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 3,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 3,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 3,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 3,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 0
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 42
          },






          {
              "cardTypeId": 0,
              "name": "Weapons Doggodev",
              "costs": [
                  {
                      "statId": 1,
                      "value": 4,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Add a copy to the last minion you played into your hands.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Magic",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 4,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 4,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 4,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 4,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 0
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 43
          },





          {
              "cardTypeId": 0,
              "name": "Regulatoor Hound",
              "costs": [
                  {
                      "statId": 1,
                      "value": 4,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Set a random enemy minion attack to 1.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Citizen",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 2,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 3,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 3,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 0
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 44
          },




          {
              "cardTypeId": 0,
              "name": "Fanged Chaos",
              "costs": [
                  {
                      "statId": 1,
                      "value": 4,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Give +1 HP to your god.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Evil",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 1,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 1,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 1,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 1,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 0
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 45
          },




          {
              "cardTypeId": 0,
              "name": "Hopium Trader",
              "costs": [
                  {
                      "statId": 1,
                      "value": 5,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Draw 2 cards.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Citizen",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 2,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 2,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 0
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 46
          },






          {
              "cardTypeId": 0,
              "name": "Snow Shoober",
              "costs": [
                  {
                      "statId": 1,
                      "value": 5,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "-2 HP to a random opponent minion.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Citizen",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 4,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 4,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 1,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 1,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 0
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 47
          },





          {
              "cardTypeId": 0,
              "name": "Potion Shiller",
              "costs": [
                  {
                      "statId": 1,
                      "value": 6,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Whenever you attack with this minion, give +2 attack to a random friendly creature.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Evil",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 5,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 5,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 2,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 0
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 48
          },




          {
              "cardTypeId": 0,
              "name": "Caesar the Gaurdian",
              "costs": [
                  {
                      "statId": 1,
                      "value": 7,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Set a random opponent minion to 2 HP.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Citizen",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 5,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 5,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 7,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 7,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 0
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 49
          },






          {
              "cardTypeId": 0,
              "name": "Lucky Ancient",
              "costs": [
                  {
                      "statId": 1,
                      "value": 7,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "When played, there is a 50% chance to deal 3 damage to the enemy god.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Magic",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 7,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 7,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 7,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 7,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 0
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 50
          },





          {
              "cardTypeId": 0,
              "name": "Cheems Hammer",
              "costs": [
                  {
                      "statId": 1,
                      "value": 1,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Upon death, your god recieves +4 HP.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Magic",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 2,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 2,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 3
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 51
          },








          {
              "cardTypeId": 0,
              "name": "Grim Sheeber",
              "costs": [
                  {
                      "statId": 1,
                      "value": 1,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Confuse a random enemy minion.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Evil",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 2,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 1,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 1,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 3
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 52
          },




          {
              "cardTypeId": 0,
              "name": "Armored Talons",
              "costs": [
                  {
                      "statId": 1,
                      "value": 2,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Whenever a friendly minion dies, this creature gets +1 HP.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 2,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 2,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 3
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 53
          },





          {
              "cardTypeId": 0,
              "name": "Diesel the Demon",
              "costs": [
                  {
                      "statId": 1,
                      "value": 3,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Destroy a friendly minion and this creature get its strength and health.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Evil",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 3,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 3,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 3,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 3,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 3
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 54
          },



          {
              "cardTypeId": 0,
              "name": "Gladiator Shiborc",
              "costs": [
                  {
                      "statId": 1,
                      "value": 3,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "If this is your only minion on the board, it gets +2 attack.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Citizen",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 2,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 4,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 4,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 3
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 55
          },


          {
              "cardTypeId": 0,
              "name": "Brutus the Bonker",
              "costs": [
                  {
                      "statId": 1,
                      "value": 4,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Reduce the mana of all cards in your hands by 1.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Citizen",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 2,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 4,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 4,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 3
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 56
          },





          {
              "cardTypeId": 0,
              "name": "Mercenary Shibtaur",
              "costs": [
                  {
                      "statId": 1,
                      "value": 4,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Confuse a random enemy minion.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Citizen",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 4,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 4,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 3,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 3,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 3
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 57
          },






          {
              "cardTypeId": 0,
              "name": "Ancient Sword",
              "costs": [
                  {
                      "statId": 1,
                      "value": 5,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Lightning",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Magic",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 5,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 5,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 2,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 3
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 58
          },


          {
              "cardTypeId": 0,
              "name": "Sandune Snarler",
              "costs": [
                  {
                      "statId": 1,
                      "value": 6,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Destroy a random enemy minion with health 3 or less.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Evil",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 5,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 5,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 2,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 3
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 59
          },





          {
              "cardTypeId": 0,
              "name": "Howling Oaks",
              "costs": [
                  {
                      "statId": 1,
                      "value": 7,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Deal 3 damage to a selected minion.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 6,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 6,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 6,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 6,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 3
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 60
          },






          {
              "cardTypeId": 0,
              "name": "Savant Shibatician",
              "costs": [
                  {
                      "statId": 1,
                      "value": 2,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "All of your confused minions recieve +2 health.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Magic",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 2,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 2,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 2,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 2
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 61
          },




          {
              "cardTypeId": 0,
              "name": "Gnarling Swamp Spammer",
              "costs": [
                  {
                      "statId": 1,
                      "value": 2,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Whenever a spell is cast, give a copy of it to the other player.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Evil",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": 1,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": 1,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 1,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 1,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 1
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Draw 1 card.",
                      "type": "Triggered",
                      "effect": {
                          "numCards": 1,
                          "$type": "CCGKit.DrawCardsEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.PlayerTarget"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 62
          },








          {
              "cardTypeId": 1,
              "name": "Rug Pull",
              "costs": [
                  {
                      "statId": 1,
                      "value": 4,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "-2 HP to all of your opponents minions.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Spell",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Evil",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 1
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Deal 1 damage",
                      "type": "Triggered",
                      "effect": {
                          "value": {
                              "constant": 1,
                              "$type": "CCGKit.ConstantValue"
                          },
                          "duration": 0,
                          "statId": 1,
                          "gameZoneId": 2,
                          "cardTypeId": 0,
                          "$type": "CCGKit.DecreaseCardStatEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.AllOpponentCards"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 63
          },







          {
              "cardTypeId": 1,
              "name": "Stacking Sats",
              "costs": [
                  {
                      "statId": 1,
                      "value": 3,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Add 1 HP to each friendly minion.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Spell",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Neutral",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 2
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Deal 1 damage",
                      "type": "Triggered",
                      "effect": {
                          "value": {
                              "constant": 1,
                              "$type": "CCGKit.ConstantValue"
                          },
                          "duration": 0,
                          "statId": 1,
                          "gameZoneId": 2,
                          "cardTypeId": 0,
                          "$type": "CCGKit.DecreaseCardStatEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.AllOpponentCards"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 64
          },





          {
              "cardTypeId": 1,
              "name": "Mana Airdrop",
              "costs": [
                  {
                      "statId": 1,
                      "value": 2,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Deal 1 damage point to your opponents god and reduce the cost of spells in your hand by 1.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Spell",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Neutral",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 2
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Deal 1 damage",
                      "type": "Triggered",
                      "effect": {
                          "value": {
                              "constant": 1,
                              "$type": "CCGKit.ConstantValue"
                          },
                          "duration": 0,
                          "statId": 1,
                          "gameZoneId": 2,
                          "cardTypeId": 0,
                          "$type": "CCGKit.DecreaseCardStatEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.AllOpponentCards"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 65
          },



          {
              "cardTypeId": 1,
              "name": "Flashloan Attack",
              "costs": [
                  {
                      "statId": 1,
                      "value": 1,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "2/3 chance to reduce opponents gods HP by 2.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Spell",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Magic",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 0
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Deal 1 damage",
                      "type": "Triggered",
                      "effect": {
                          "value": {
                              "constant": 1,
                              "$type": "CCGKit.ConstantValue"
                          },
                          "duration": 0,
                          "statId": 1,
                          "gameZoneId": 2,
                          "cardTypeId": 0,
                          "$type": "CCGKit.DecreaseCardStatEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.AllOpponentCards"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 66
          },




          {
              "cardTypeId": 1,
              "name": "Shiba Freeze",
              "costs": [
                  {
                      "statId": 1,
                      "value": 1,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Freeze a minion and deal 1 damage to it.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Spell",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Magic",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 0
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Deal 1 damage",
                      "type": "Triggered",
                      "effect": {
                          "value": {
                              "constant": 1,
                              "$type": "CCGKit.ConstantValue"
                          },
                          "duration": 0,
                          "statId": 1,
                          "gameZoneId": 2,
                          "cardTypeId": 0,
                          "$type": "CCGKit.DecreaseCardStatEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.AllOpponentCards"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 67
          },







          {
              "cardTypeId": 1,
              "name": "Sellout",
              "costs": [
                  {
                      "statId": 1,
                      "value": 1,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Add 1 HP to each friendly minion.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Spell",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Citizen",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 0
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Deal 1 damage",
                      "type": "Triggered",
                      "effect": {
                          "value": {
                              "constant": 1,
                              "$type": "CCGKit.ConstantValue"
                          },
                          "duration": 0,
                          "statId": 1,
                          "gameZoneId": 2,
                          "cardTypeId": 0,
                          "$type": "CCGKit.DecreaseCardStatEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.AllOpponentCards"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 68
          },



          {
              "cardTypeId": 1,
              "name": "FUD",
              "costs": [
                  {
                      "statId": 1,
                      "value": 1,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "-1 HP to all opponent minions.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Spell",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Evil",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 2
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Deal 1 damage",
                      "type": "Triggered",
                      "effect": {
                          "value": {
                              "constant": 1,
                              "$type": "CCGKit.ConstantValue"
                          },
                          "duration": 0,
                          "statId": 1,
                          "gameZoneId": 2,
                          "cardTypeId": 0,
                          "$type": "CCGKit.DecreaseCardStatEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.AllOpponentCards"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 69
          },





          {
              "cardTypeId": 1,
              "name": "Smart Contacts",
              "costs": [
                  {
                      "statId": 1,
                      "value": 1,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Add 2 HP and 1 attack to a random friendly minion.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Spell",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Neutral",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 1
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Deal 1 damage",
                      "type": "Triggered",
                      "effect": {
                          "value": {
                              "constant": 1,
                              "$type": "CCGKit.ConstantValue"
                          },
                          "duration": 0,
                          "statId": 1,
                          "gameZoneId": 2,
                          "cardTypeId": 0,
                          "$type": "CCGKit.DecreaseCardStatEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.AllOpponentCards"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 70
          },



          {
              "cardTypeId": 1,
              "name": "Copy Pasta",
              "costs": [
                  {
                      "statId": 1,
                      "value": 2,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Duplicate the lowest mana cost minion in your hand.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Spell",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Neutral",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 2
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Deal 1 damage",
                      "type": "Triggered",
                      "effect": {
                          "value": {
                              "constant": 1,
                              "$type": "CCGKit.ConstantValue"
                          },
                          "duration": 0,
                          "statId": 1,
                          "gameZoneId": 2,
                          "cardTypeId": 0,
                          "$type": "CCGKit.DecreaseCardStatEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.AllOpponentCards"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 71
          },





          {
              "cardTypeId": 1,
              "name": "Maximum TPS",
              "costs": [
                  {
                      "statId": 1,
                      "value": 1,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Add 2 attack points to all friendly minions.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Spell",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Magic",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 1
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Deal 1 damage",
                      "type": "Triggered",
                      "effect": {
                          "value": {
                              "constant": 1,
                              "$type": "CCGKit.ConstantValue"
                          },
                          "duration": 0,
                          "statId": 1,
                          "gameZoneId": 2,
                          "cardTypeId": 0,
                          "$type": "CCGKit.DecreaseCardStatEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.AllOpponentCards"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 72
          },





          {
              "cardTypeId": 1,
              "name": "Mint",
              "costs": [
                  {
                      "statId": 1,
                      "value": 1,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Add 2 HP to your god.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Spell",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Citizen",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 3
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Deal 1 damage",
                      "type": "Triggered",
                      "effect": {
                          "value": {
                              "constant": 1,
                              "$type": "CCGKit.ConstantValue"
                          },
                          "duration": 0,
                          "statId": 1,
                          "gameZoneId": 2,
                          "cardTypeId": 0,
                          "$type": "CCGKit.DecreaseCardStatEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.AllOpponentCards"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 73
          },




          {
              "cardTypeId": 1,
              "name": "Random Function",
              "costs": [
                  {
                      "statId": 1,
                      "value": 3,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Decrease the mana cost of a random card in your hand by 2 points.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Spell",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Magic",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 0
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Deal 1 damage",
                      "type": "Triggered",
                      "effect": {
                          "value": {
                              "constant": 1,
                              "$type": "CCGKit.ConstantValue"
                          },
                          "duration": 0,
                          "statId": 1,
                          "gameZoneId": 2,
                          "cardTypeId": 0,
                          "$type": "CCGKit.DecreaseCardStatEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.AllOpponentCards"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 74
          },




          {
              "cardTypeId": 1,
              "name": "Stablecoin",
              "costs": [
                  {
                      "statId": 1,
                      "value": 2,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Add 1 HP to all friendly minions.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Spell",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Magic",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 0
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Deal 1 damage",
                      "type": "Triggered",
                      "effect": {
                          "value": {
                              "constant": 1,
                              "$type": "CCGKit.ConstantValue"
                          },
                          "duration": 0,
                          "statId": 1,
                          "gameZoneId": 2,
                          "cardTypeId": 0,
                          "$type": "CCGKit.DecreaseCardStatEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.AllOpponentCards"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 75
          },




          {
              "cardTypeId": 1,
              "name": "Regulatooor",
              "costs": [
                  {
                      "statId": 1,
                      "value": 6,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "- 3 HP to all opponent minions.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Spell",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Citizen",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 1
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Deal 1 damage",
                      "type": "Triggered",
                      "effect": {
                          "value": {
                              "constant": 1,
                              "$type": "CCGKit.ConstantValue"
                          },
                          "duration": 0,
                          "statId": 1,
                          "gameZoneId": 2,
                          "cardTypeId": 0,
                          "$type": "CCGKit.DecreaseCardStatEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.AllOpponentCards"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 76
          },




          {
              "cardTypeId": 1,
              "name": "Diamond Hands",
              "costs": [
                  {
                      "statId": 1,
                      "value": 5,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Draw 2 random cards and unconfuse all friendly minions.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Spell",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 2
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Deal 1 damage",
                      "type": "Triggered",
                      "effect": {
                          "value": {
                              "constant": 1,
                              "$type": "CCGKit.ConstantValue"
                          },
                          "duration": 0,
                          "statId": 1,
                          "gameZoneId": 2,
                          "cardTypeId": 0,
                          "$type": "CCGKit.DecreaseCardStatEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.AllOpponentCards"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 77
          },





          {
              "cardTypeId": 1,
              "name": "Picker",
              "costs": [
                  {
                      "statId": 1,
                      "value": 3,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Draw 2 random cards.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Spell",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Neutral",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 0
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Deal 1 damage",
                      "type": "Triggered",
                      "effect": {
                          "value": {
                              "constant": 1,
                              "$type": "CCGKit.ConstantValue"
                          },
                          "duration": 0,
                          "statId": 1,
                          "gameZoneId": 2,
                          "cardTypeId": 0,
                          "$type": "CCGKit.DecreaseCardStatEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.AllOpponentCards"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 78
          },





          {
              "cardTypeId": 1,
              "name": "Doggo Vision",
              "costs": [
                  {
                      "statId": 1,
                      "value": 4,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "See the top 4 cards of your enemies deck.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Spell",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 0
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Deal 1 damage",
                      "type": "Triggered",
                      "effect": {
                          "value": {
                              "constant": 1,
                              "$type": "CCGKit.ConstantValue"
                          },
                          "duration": 0,
                          "statId": 1,
                          "gameZoneId": 2,
                          "cardTypeId": 0,
                          "$type": "CCGKit.DecreaseCardStatEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.AllOpponentCards"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 79
          },



          {
              "cardTypeId": 1,
              "name": "Burn",
              "costs": [
                  {
                      "statId": 1,
                      "value": 6,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Destroy the targeted minion and +3 HP to your god.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Spell",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 0
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Deal 1 damage",
                      "type": "Triggered",
                      "effect": {
                          "value": {
                              "constant": 1,
                              "$type": "CCGKit.ConstantValue"
                          },
                          "duration": 0,
                          "statId": 1,
                          "gameZoneId": 2,
                          "cardTypeId": 0,
                          "$type": "CCGKit.DecreaseCardStatEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.AllOpponentCards"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 80
          },




          {
              "cardTypeId": 1,
              "name": "Satcrifice",
              "costs": [
                  {
                      "statId": 1,
                      "value": 1,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Destroy the targeted minion and draw 2 random cards.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Spell",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Magic",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 3
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Deal 1 damage",
                      "type": "Triggered",
                      "effect": {
                          "value": {
                              "constant": 1,
                              "$type": "CCGKit.ConstantValue"
                          },
                          "duration": 0,
                          "statId": 1,
                          "gameZoneId": 2,
                          "cardTypeId": 0,
                          "$type": "CCGKit.DecreaseCardStatEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.AllOpponentCards"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 81
          },




          {
              "cardTypeId": 1,
              "name": "Bags Filled",
              "costs": [
                  {
                      "statId": 1,
                      "value": 2,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Selected friendly minion attacks all enemy creatures present on the board.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Spell",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Neutral",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 3
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Deal 1 damage",
                      "type": "Triggered",
                      "effect": {
                          "value": {
                              "constant": 1,
                              "$type": "CCGKit.ConstantValue"
                          },
                          "duration": 0,
                          "statId": 1,
                          "gameZoneId": 2,
                          "cardTypeId": 0,
                          "$type": "CCGKit.DecreaseCardStatEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.AllOpponentCards"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 82
          },




          {
              "cardTypeId": 1,
              "name": "Shiba Riot",
              "costs": [
                  {
                      "statId": 1,
                      "value": 3,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Reset attack and HP to base for all friendly creatures and remove any Freeze and Confuse.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Spell",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Evil",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 3
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Deal 1 damage",
                      "type": "Triggered",
                      "effect": {
                          "value": {
                              "constant": 1,
                              "$type": "CCGKit.ConstantValue"
                          },
                          "duration": 0,
                          "statId": 1,
                          "gameZoneId": 2,
                          "cardTypeId": 0,
                          "$type": "CCGKit.DecreaseCardStatEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.AllOpponentCards"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 83
          },





          {
              "cardTypeId": 1,
              "name": "Double Spend",
              "costs": [
                  {
                      "statId": 1,
                      "value": 4,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Deal 3 Damage to a targeted minion along with the enemy god.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Spell",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": "Neutral",
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 3
                  }],
              "abilities": [
                  {
                      "trigger": {
                          "zoneId": 2,
                          "$type": "CCGKit.OnCardEnteredZoneTrigger"
                      },
                      "name": "Deal 1 damage",
                      "type": "Triggered",
                      "effect": {
                          "value": {
                              "constant": 1,
                              "$type": "CCGKit.ConstantValue"
                          },
                          "duration": 0,
                          "statId": 1,
                          "gameZoneId": 2,
                          "cardTypeId": 0,
                          "$type": "CCGKit.DecreaseCardStatEffect"
                      },
                      "target": {
                          "conditions": [],
                          "$type": "CCGKit.AllOpponentCards"
                      },
                      "$type": "CCGKit.TriggeredAbility"
                  }
              ],
              "id": 84
          },





          {
              "cardTypeId": 2,
              "name": "Gaeam",
              "costs": [
                  {
                      "statId": 1,
                      "value": null,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Enemy creatures go to Sleep",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": null,
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": null,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": null,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 30,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 30,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 0
                  }],
              "abilities": [],
              "id": 85
          },





          {
              "cardTypeId": 2,
              "name": "Myx ",
              "costs": [
                  {
                      "statId": 1,
                      "value": null,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Give -1 HP to each ennemy minions.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": null,
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": null,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": null,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 30,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 30,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 0
                  }],
              "abilities": [],
              "id": 86
          },


          {
              "cardTypeId": 2,
              "name": "Cosmas",
              "costs": [
                  {
                      "statId": 1,
                      "value": null,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Give +1 HP to each friendly minions.",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": null,
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": null,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": null,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 30,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 30,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 0
                  }],
              "abilities": [],
              "id": 87
          },



          {
              "cardTypeId": 2,
              "name": "Anamke",
              "costs": [
                  {
                      "statId": 1,
                      "value": null,
                      "$type": "CCGKit.PayResourceCost"
                  }
              ],
              "properties": [
                  {
                      "value": "Add 2 mana for the current turn",
                      "name": "Text",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": "Creature",
                      "name": "Picture",
                      "$type": "CCGKit.StringProperty"
                  },
                  {
                      "value": 4,
                      "name": "MaxCopies",
                      "$type": "CCGKit.IntProperty"
                  },
                  {
                      "value": null,
                      "name": "Material",
                      "$type": "CCGKit.StringProperty"
                  }
              ],
              "stats": [
                  {
                      "baseValue": null,
                      "statId": 0,
                      "name": "Attack",
                      "originalValue": null,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  },
                  {
                      "baseValue": 30,
                      "statId": 1,
                      "name": "Life",
                      "originalValue": 30,
                      "minValue": 0,
                      "maxValue": 99,
                      "modifiers": []
                  }
              ],
               "keywords": [{
                      "keywordId": 0,
                      "valueId": 0
                  }],
              "abilities": [],
              "id": 88
          }
      ]
  }
]
