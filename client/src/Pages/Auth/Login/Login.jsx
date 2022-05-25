import LockIcon from "@mui/icons-material/Lock";
import MailIcon from "@mui/icons-material/Mail";
import PersonIcon from "@mui/icons-material/Person";

import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import React from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import Button from "../../../Shared/Button/Button";
import CheemsLogoCard from "../../../Shared/LogoCard/Card";
import Text from "../../../Shared/Text/Text";
// import { Link } from "react-router-dom";
// import { Form, FormikProvider } from "formik";
import { loginUser } from "../../../Store/Auth/actions";
import { useHistory, Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import styles from "./style.module.scss";

export default function Login(props) {
  const dispatch = useDispatch();
  const history = useHistory();

  const loginUserSchema = Yup.object().shape({
    // email: Yup.string()
    //   .email("Please enter valid email address")
    //   .required("Please enter email address"),
    username: Yup.string().required("User name is required"),
    password: Yup.string().required("Please enter password"),
  });
  const formik = useFormik({
    initialValues: {
      // email: "",
      username: "",
      password: "",
    },
    enableReinitialize: true,
    validationSchema: loginUserSchema,
    onSubmit: async (values) => {
      await dispatch(
        loginUser({
          username: values.username,
          password: values.password,
          resetForm: formik.resetForm,
          //   history: history,
        })
      );
    },
  });
  return (
    <div className={styles.loginScreen}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} className="justify-content-center">
          <Grid item xs={4}>
            <CheemsLogoCard className={styles.loginCard}>
              <div className={styles.cheemsCardContent}>
                <form onSubmit={formik.handleSubmit}>
                  <TextField
                    id="input-with-icon-textfield"
                    placeholder="User name"
                    name="username"
                    className={`${styles.loginInput} mb-3`}
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
                  {/* <TextField
                    id="input-with-icon-textfield"
                    name="email"
                    placeholder="Email"
                    className={`${styles.loginInput} mb-3`}
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
                  /> */}
                  <TextField
                    id="input-with-icon-textfield"
                    name="password"
                    placeholder="Password"
                    className={`${styles.loginInput} mb-2`}
                    InputProps={{
                      disableUnderline: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                  />
                  <Link to="/forget-password">
                    <Text mediumLight className={styles.forgotTextLogin}>
                      <u>Forgot Password?</u>
                    </Text>
                  </Link>
                  <Button
                    size={"lg"}
                    variant="outline"
                    className={styles.loginButton}
                    type="submit"
                  >
                    LOGIN
                  </Button>
                  <Button
                    size={"lg"}
                    variant="outline"
                    className={styles.createAccountButton}
                    onHandleClick={() =>
                      history.push({
                        pathname: `/signup`,
                      })
                    }
                  >
                    Create new account
                  </Button>
                </form>
              </div>
            </CheemsLogoCard>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
