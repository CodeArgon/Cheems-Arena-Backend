import tokenController from "./tokenController.js";
import con from '../config/db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const apiController={
    getTokens: async (req, res) => {
        let username=req.body.username;
        let password=req.body.password;

        // fetch data from MySQL against user
        con.query(`SELECT * FROM users WHERE username = "${username}"`, async function (err, result) {
            if (err) {
                console.log(err)
            }
            if(result[0] === undefined ){
                res.send({
                    "code": 400,
                    "error": "Username doesn't exist"
                })
            }
            if (result.length > 0) {
                let pubKey=result[0].walletAddress

                // compare passwords [ from db and users input ]
                let comparison=await bcrypt.compare(password, result[0].password).then()
                if (comparison ) {
                    if (!pubKey) {
                        return res.status(400).json({ message: "Error. Please connect wallet and send pubKey to verify." });
                    }

                    const payload = {
                        username, 
                        password
                      };
                
                     const token =  jwt.sign(
                        payload,
                        "thisissecretkey",
                        { expiresIn: '1 day' },
                      );
                    // get metadata against public key
                    let metaDataArray=await tokenController.getMetaData(pubKey);

                    let response={
                        pubKey,
                        data: metaDataArray,
                        message: "Token metaData found in user wallet.",
                        token
                    };
                    res.json(response);
                } else {
                    res.send({
                        "code": 400,
                        "error": "Username or password doesn't match"
                    })
                }
            }
        });
    },
}

export default apiController;