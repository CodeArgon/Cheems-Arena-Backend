import * as anchor from '@project-serum/anchor';
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState, useMemo } from "react"
import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
require('dotenv').config()

const NFTDisplay = () => {
  const wallet = useWallet();
  const [metaData, setMetaData] = useState<any[] | []>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const anchorWallet = useMemo(() => {
    if (
      !wallet ||
      !wallet.publicKey ||
      !wallet.signAllTransactions ||
      !wallet.signTransaction
    ) {
      return;
    }

    return {
      publicKey: wallet.publicKey,
      signAllTransactions: wallet.signAllTransactions,
      signTransaction: wallet.signTransaction,
    } as anchor.Wallet;
  }, [wallet]);

  const getTokens = (anchorWallet: { publicKey: PublicKey }) => {
    if (`http://localhost:5000`) {
      let walletPubkey: string = anchorWallet.publicKey?.toString()
      const options: RequestInit = {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pubKey: walletPubkey,
        }),
      }

      console.log(walletPubkey);

      let status: number;
      fetch(`http://localhost:5000/getTokens`, options)
        .then(res => {
          console.log(res);
          status = res.status;
          return res.json();
        })
        .then(res => {
          if (status === 200) {
            if (res && res.pubKey === walletPubkey) {
              console.log(res);
              setMetaData(res.data);
            }
          }
        })
        .catch(err => {
          console.log(err);
        })
    }
  }

  useEffect(() => {
    if (anchorWallet) {
      if (!isFetching) {
        setIsFetching(true);
        getTokens(anchorWallet);
      }
    }
  }, [anchorWallet, isFetching])

  return (
    <div className='container' id="nftdisplay">
      <h1 style={{ marginBottom: "50px" }}>
        My NFT(S)
      </h1>
      <div>
        <WalletModalProvider>
          <WalletMultiButton style={{ "backgroundColor": "#a855f7" }} />
        </WalletModalProvider>
      </div>
      <div className='img-container'>
        {
          // metaData?.length > 0 &&
          metaData.map((data: any, index: number) => (
            <>
              <div className="row" key={`${data.image}`}>
                <img className='nft-img' src={`${data.image}`} alt={`${index}`} />
                <h3 className='text-center'>{data.name}</h3>
              </div>
            </>
          ))
        }
      </div>
    </div>
  )
}

export default NFTDisplay;