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
  carddata: async (req,res) => {
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
        "name": "Card 1",
        "costs": [
          {
            "statId": 1,
            "value": 2,
            "$type": "CCGKit.PayResourceCost"
          }
        ],
        "properties": [
          {
            "value": "card 1 specification.",
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
        "name": "Wild Bear",
        "costs": [
          {
            "statId": 1,
            "value": 2,
            "$type": "CCGKit.PayResourceCost"
          }
        ],
        "properties": [
          {
            "value": "",
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
        "keywords": [],
        "abilities": [],
        "id": 1
      },
      {
        "cardTypeId": 0,
        "name": "Valorous Captain",
        "costs": [
          {
            "statId": 1,
            "value": 3,
            "$type": "CCGKit.PayResourceCost"
          }
        ],
        "properties": [
          {
            "value": "When this creature enters the board, all your creatures gain 1 attack until end of turn.",
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
        "keywords": [],
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
        "name": "Iron Golem",
        "costs": [
          {
            "statId": 1,
            "value": 4,
            "$type": "CCGKit.PayResourceCost"
          }
        ],
        "properties": [
          {
            "value": "",
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
            "baseValue": 4,
            "statId": 0,
            "name": "Attack",
            "originalValue": 4,
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
        "keywords": [],
        "abilities": [],
        "id": 3
      },
      {
        "cardTypeId": 0,
        "name": "Raging Dragon",
        "costs": [
          {
            "statId": 1,
            "value": 6,
            "$type": "CCGKit.PayResourceCost"
          }
        ],
        "properties": [
          {
            "value": "Draw 1 card.",
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
            "baseValue": 6,
            "statId": 0,
            "name": "Attack",
            "originalValue": 6,
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
        "keywords": [],
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
        "cardTypeId": 1,
        "name": "Divine Touch",
        "costs": [
          {
            "statId": 1,
            "value": 4,
            "$type": "CCGKit.PayResourceCost"
          }
        ],
        "properties": [
          {
            "value": "You gain 8 life.",
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
            "value": null,
            "name": "Material",
            "$type": "CCGKit.StringProperty"
          }
        ],
        "stats": [],
        "keywords": [],
        "abilities": [
          {
            "trigger": {
              "zoneId": 2,
              "$type": "CCGKit.OnCardEnteredZoneTrigger"
            },
            "name": "Gain 8 life",
            "type": "Triggered",
            "effect": {
              "statId": 0,
              "value": {
                "constant": 8,
                "$type": "CCGKit.ConstantValue"
              },
              "duration": 0,
              "$type": "CCGKit.IncreasePlayerStatEffect"
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
        "cardTypeId": 1,
        "name": "Explosion",
        "costs": [
          {
            "statId": 1,
            "value": 2,
            "$type": "CCGKit.PayResourceCost"
          }
        ],
        "properties": [
          {
            "value": "Deal 1 damage to all enemy creatures.",
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
            "value": null,
            "name": "Material",
            "$type": "CCGKit.StringProperty"
          }
        ],
        "stats": [],
        "keywords": [],
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
        "id": 6
      },
      {
        "cardTypeId": 1,
        "name": "Combat Rage",
        "costs": [
          {
            "statId": 1,
            "value": 1,
            "$type": "CCGKit.PayResourceCost"
          }
        ],
        "properties": [
          {
            "value": "Target creature you control gains +3/+0 until end of turn.",
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
            "value": null,
            "name": "Material",
            "$type": "CCGKit.StringProperty"
          }
        ],
        "stats": [],
        "keywords": [],
        "abilities": [
          {
            "trigger": {
              "zoneId": 2,
              "$type": "CCGKit.OnCardEnteredZoneTrigger"
            },
            "name": "+3 attack",
            "type": "Triggered",
            "effect": {
              "value": {
                "constant": 3,
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
              "$type": "CCGKit.PlayerCard"
            },
            "$type": "CCGKit.TriggeredAbility"
          }
        ],
        "id": 7
      },
      {
        "cardTypeId": 1,
        "name": "Mana Growth",
        "costs": [
          {
            "statId": 1,
            "value": 0,
            "$type": "CCGKit.PayResourceCost"
          }
        ],
        "properties": [
          {
            "value": "Add 1 mana to your mana pool.",
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
            "value": null,
            "name": "Material",
            "$type": "CCGKit.StringProperty"
          }
        ],
        "stats": [],
        "keywords": [],
        "abilities": [
          {
            "trigger": {
              "zoneId": 2,
              "$type": "CCGKit.OnCardEnteredZoneTrigger"
            },
            "name": "+1 mana",
            "type": "Triggered",
            "effect": {
              "statId": 1,
              "value": {
                "constant": 1,
                "$type": "CCGKit.ConstantValue"
              },
              "duration": 1,
              "$type": "CCGKit.IncreasePlayerStatEffect"
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
        "cardTypeId": 1,
        "name": "Terror",
        "costs": [
          {
            "statId": 1,
            "value": 2,
            "$type": "CCGKit.PayResourceCost"
          }
        ],
        "properties": [
          {
            "value": "Destroy target creature.",
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
            "value": null,
            "name": "Material",
            "$type": "CCGKit.StringProperty"
          }
        ],
        "stats": [],
        "keywords": [],
        "abilities": [
          {
            "trigger": {
              "zoneId": 2,
              "$type": "CCGKit.OnCardEnteredZoneTrigger"
            },
            "name": "Destroy creature",
            "type": "Triggered",
            "effect": {
              "value": {
                "constant": 0,
                "$type": "CCGKit.ConstantValue"
              },
              "duration": 0,
              "statId": 1,
              "gameZoneId": 2,
              "cardTypeId": 0,
              "$type": "CCGKit.SetCardStatEffect"
            },
            "target": {
              "conditions": [],
              "$type": "CCGKit.TargetCard"
            },
            "$type": "CCGKit.TriggeredAbility"
          }
        ],
        "id": 9
      }
    ]
  },
  {
    "name": "Set 2",
    "cards": [
      {
        "cardTypeId": 0,
        "name": "Vengeful Vampire",
        "costs": [
          {
            "statId": 1,
            "value": 2,
            "$type": "CCGKit.PayResourceCost"
          }
        ],
        "properties": [
          {
            "value": "When this creature dies, it deals 1 damage to enemy player.",
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
        "keywords": [],
        "abilities": [
          {
            "trigger": {
              "zoneId": 3,
              "$type": "CCGKit.OnCardEnteredZoneTrigger"
            },
            "name": "Deal 1 damage to player",
            "type": "Triggered",
            "effect": {
              "statId": 0,
              "value": {
                "constant": 1,
                "$type": "CCGKit.ConstantValue"
              },
              "duration": 0,
              "$type": "CCGKit.DecreasePlayerStatEffect"
            },
            "target": {
              "conditions": [],
              "$type": "CCGKit.OpponentTarget"
            },
            "$type": "CCGKit.TriggeredAbility"
          }
        ],
        "id": 10
      },
      {
        "cardTypeId": 0,
        "name": "Elvish Healer",
        "costs": [
          {
            "statId": 1,
            "value": 1,
            "$type": "CCGKit.PayResourceCost"
          }
        ],
        "properties": [
          {
            "value": "<b>Provoke</b>. When this creature enters the board, it adds a +0/+1 counter to all your creatures.",
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
        "keywords": [
          {
            "keywordId": 0,
            "valueId": 1
          }
        ],
        "abilities": [
          {
            "trigger": {
              "zoneId": 2,
              "$type": "CCGKit.OnCardEnteredZoneTrigger"
            },
            "name": "Heal 1 damage",
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
              "$type": "CCGKit.IncreaseCardStatEffect"
            },
            "target": {
              "conditions": [],
              "$type": "CCGKit.AllPlayerCards"
            },
            "$type": "CCGKit.TriggeredAbility"
          }
        ],
        "id": 11
      }
    ]
  }
]