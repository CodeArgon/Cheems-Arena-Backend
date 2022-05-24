import tokenController from "./tokenController.js";
import con from '../config/db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from "../models/users.js";

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
                "error": "Username doesn't exist"
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
                let metaDataArray = await tokenController.getMetaData(pubKey);

                let response = {
                    LoginDataRoot: {
                        pubKey,
                        data: metaDataArray,
                        message: "Token metaData found in user wallet.",
                        token,
                    }
                };
                response.user = user
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