import fetch from "node-fetch";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import con from "../config/db.js";
import { MintList } from "../models/mint_list.js";

let addresses = [];
const tokenService = {
  getTokenAccounts: async (connection, pubKeyString) => {
    let accounts;
    if (pubKeyString) {
      accounts = await connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
        filters: [
          {
            dataSize: 165,
          },
          {
            memcmp: {
              offset: 32,
              bytes: pubKeyString,
            },
          },
        ],
      });
    }

    console.log(
      `Found ${accounts?.length} account(s) for pubKey ${pubKeyString}.`
    );
    return accounts;
  },

  getTokenData: async (connection, token) => {
    try {
      if (token && token.mint) {
        let mintPubkey = new PublicKey(token.mint);
        let tokenmetaPubkey = await Metadata.getPDA(mintPubkey);

        let tokenData = await Metadata.load(connection, tokenmetaPubkey);
        const addresses = await MintList.findAll();

        for (let i = 1; i < addresses.length; i++) {
          if (addresses[i].mint === tokenData.data.mint) {
            return tokenData;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  },

  getMetaData: async (tokenData) => {
    let metaData = {};
    if (tokenData) {
      let metaDataUri = tokenData.data?.data?.uri;

      let response = await fetch(metaDataUri)
        .then((res) => res.json())
        .catch((err) => {
          console.log(err);
        });

      if (response && response.image) {
        metaData = response;
      }
    }
    return metaData;
  },
};

export default tokenService;
