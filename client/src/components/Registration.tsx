import { Fragment, useState, useEffect, useMemo } from 'react'
import { PublicKey } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import '@solana/wallet-adapter-react-ui/styles.css'
import {
  WalletModalProvider,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui'
import axios from 'axios'

const Register = () => {
  let walletPubkey: string
  const wallet = useWallet()
  const [txt, setTxt] = useState<any[] | []>([])
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    walletAddress: '',
  })

  const anchorWallet = useMemo(() => {
    if (
      !wallet ||
      !wallet.publicKey ||
      !wallet.signAllTransactions ||
      !wallet.signTransaction
    ) {
      return
    }

    return {
      publicKey: wallet.publicKey,
      signAllTransactions: wallet.signAllTransactions,
      signTransaction: wallet.signTransaction,
    }
  }, [wallet])

  const { username, email, password, walletAddress } = formData

  const onChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const getWalletAddress = (anchorWallet: { publicKey: PublicKey }) => {
    walletPubkey = anchorWallet.publicKey?.toString()
  }
  const onSubmit = async (e: any) => {
    e.preventDefault()
    const newUser = {
      username,
      email,
      password,
      walletAddress,
    }
    newUser.walletAddress = walletPubkey

    console.log(walletPubkey)

    const body = JSON.stringify(newUser)
    console.log(body)

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    try {
      if (walletAddress === null) {
        alert("Connect wallet")
      } else {
        const res = await axios.post(`http://ec2-13-38-127-249.eu-west-3.compute.amazonaws.com/api/v1/signup`, body, config)
        console.log(res)
        console.log(res.data)
        console.log(res.data.status)
        if (res.data.status == 400) {
          alert(res.data.msg)
        } else if (res.data.status == 200) {
          alert(res.data.msg)
        }
      }
      // if (res.data.status == 400) {
      //   alert(res.data.msg)
      // }
    } catch (error) {
      console.log(error)
    }

  }

  useEffect(() => {
    if (anchorWallet) {
      getWalletAddress(anchorWallet)
    }
  }, [anchorWallet])

  const onInputChange = (e: any) => {
    const { value } = e.target

    const regex = /^(?:[a-z0-9]+|\d+)$/
    if (value === '' || regex.test(value)) {
      setTxt(value)
    } else {
      alert(
        'Use only lowercase alphabets and numbers, Remove special character'
      )
    }
  }

  return (
    <Fragment>
      <div className='container text-center'>
        <h1 className='large'>Sign Up</h1>
        <p className='lead'>
          <i className='fas fa-user'></i> Create Your Account
        </p>
        <form className='form' onSubmit={onSubmit}>
          <div className='form-group'>
            <input
              className='my-3'
              type='text'
              placeholder='Username'
              name='username'
              value={username}
              onChange={(e) => {
                onChange(e)
                onInputChange(e)
              }}
            />
            <br />
            <input
              className='my-3'
              type='email'
              placeholder='Email'
              name='email'
              value={email}
              onChange={(e) => onChange(e)}
            />
            <br />
            <input
              className='my-3'
              type='password'
              placeholder='Password'
              name='password'
              //   minLength='8'
              value={password}
              onChange={(e) => onChange(e)}
            />
            <br />
            <div>
              <WalletModalProvider>
                <WalletMultiButton style={{ backgroundColor: '#a855f7' }} />
              </WalletModalProvider>
            </div>
          </div>
          <br />
          <input
            type='submit'
            className='btn btn-outline-dark'
            value='Register'
          />
        </form>
      </div>
    </Fragment>
  )
}
export default Register
