import LockIcon from "@mui/icons-material/Lock";
import MailIcon from "@mui/icons-material/Mail";
import PersonIcon from "@mui/icons-material/Person";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import Button from "../../../Shared/Button/Button";
import CheemsLogoCard from "../../../Shared/LogoCard/Card";
import { registerUser } from "../../../Store/Auth/actions";
import styles from "./style.module.scss";

export default function SignUp(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [walletAddress, setWalletAddress] = useState(null);
  const signUpUserSchema = Yup.object().shape({
    username: Yup.string().required("Please enter user name"),
    email: Yup.string()
      .email("Please enter valid email address")
      .required("Please enter email address"),

    password: Yup.string().required("Please enter password"),
    passwordConfirmation: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("This field is required"),
  });
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
    enableReinitialize: true,
    validationSchema: signUpUserSchema,
    onSubmit: async (values) => {
      if (walletAddress !== null) {
        await dispatch(
          registerUser({
            username: values.username,
            email: values.email,
            password: values.password,
            walletAddress: walletAddress,
            resetForm: formik.resetForm,
            //   history: history,
          })
        );
      } else {
        toast.error("Kindly connect wallet first");
      }
    },
  });

  // Phantom wallet integration

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;
      if (solana) {
        if (solana.isPhantom) {
          console.log("Wallet Found");
          const response = await solana.connect({
            onlyIfTrusted: true,
          });
          setWalletAddress(response.publicKey.toString());
        } else {
          toast.error("Wallet not found ! Install Phantom wallet extension");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;
    if (solana) {
      const response = await solana.connect();
      setWalletAddress(response.publicKey.toString());
    } else {
      toast.error("Wallet not found ! Install Phantom wallet extension");
    }
  };

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <div className={styles.signUpScreen}>
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div
            className="col-md-8 col-lg-4"
            style={{ marginTop: "120px", marginBottom: "60px" }}
          >
            <CheemsLogoCard className={styles.signUpCard}>
              <div className={styles.cheemsCardContent}>
                <form onSubmit={formik.handleSubmit}>
                  <TextField
                    id="input-with-icon-textfield"
                    placeholder="User name"
                    name="username"
                    className={`${styles.signUpInput} mb-2`}
                    InputProps={{
                      disableUnderline: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.username && Boolean(formik.errors.username)
                    }
                    helperText={
                      formik.touched.username && formik.errors.username
                    }
                  />
                  <TextField
                    id="input-with-icon-textfield"
                    placeholder="Email"
                    name="email"
                    className={`${styles.signUpInput} mb-2`}
                    InputProps={{
                      disableUnderline: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <MailIcon />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />

                  <TextField
                    id="input-with-icon-textfield"
                    placeholder="Password"
                    name="password"
                    className={`${styles.signUpInput} mb-2`}
                    InputProps={{
                      disableUnderline: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                  />
                  <TextField
                    id="input-with-icon-textfield"
                    placeholder="Password Confirmation"
                    name="passwordConfirmation"
                    className={`${styles.signUpInput} mb-2`}
                    InputProps={{
                      disableUnderline: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                    type="password"
                    value={formik.values.passwordConfirmation}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.passwordConfirmation &&
                      Boolean(formik.errors.passwordConfirmation)
                    }
                    helperText={
                      formik.touched.passwordConfirmation &&
                      formik.errors.passwordConfirmation
                    }
                  />
                  <Button
                    size={"lg"}
                    variant="outline"
                    className={styles.signUpButton}
                    onClick={connectWallet}
                  >
                    <b>
                      {walletAddress === null
                        ? "Connect Phantom Wallet"
                        : `${walletAddress.slice(
                            0,
                            4
                          )}.....${walletAddress.slice(
                            walletAddress.length - 8,
                            walletAddress.length
                          )}`}
                    </b>
                  </Button>
                  <Button
                    size={"lg"}
                    variant="outline"
                    type="submit"
                    className={styles.createAccountButton}
                    // onHandleClick={formik.handleSubmit}
                  >
                    Create new account
                  </Button>
                </form>
              </div>
            </CheemsLogoCard>
          </div>
        </div>
      </div>
    </div>
  );
}
