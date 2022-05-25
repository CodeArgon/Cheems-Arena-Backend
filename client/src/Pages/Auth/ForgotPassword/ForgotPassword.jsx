import LockIcon from "@mui/icons-material/Lock";
import MailIcon from "@mui/icons-material/Mail";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import Button from "../../../Shared/Button/Button";
import Card from "../../../Shared/Card/Card";
import Text from "../../../Shared/Text/Text";
import Heading from "../../../Shared/Heading/Heading";
// import { Form, FormikProvider } from "formik";
import { forgotPassword } from "../../../Store/Auth/actions";
import { useHistory, Link } from "react-router-dom";
import ArrowIcon from "../../../Assets/Images/arrow_back.png";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import styles from "./style.module.scss";

export default function ForgotPassword(props) {
  const [activeTab, setActiveTab] = useState(0);
  const dispatch = useDispatch();
  const history = useHistory();

  const forgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email("Please enter valid email address")
      .required("Please enter email address"),
  });
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    enableReinitialize: true,
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      await dispatch(
        forgotPassword({
          email: values.email,
          callBack: (value) =>
            value == true ? setActiveTab(1) : setActiveTab(0),
          resetForm: formik.resetForm,
          //   history: history,
        })
      );
    },
  });
  return (
    <div className={styles.forgetScreen}>
      {/* <div className={styles.arrowImage}>
        <img
          alt="back-arrow"
          className={styles.imgStyle}
          src={ArrowIcon}
          height="40"
          width="60"
          onClick={() =>
            history.push({
              pathname: `/`,
            })
          }
        />
      </div> */}
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div
            className="col-md-4"
            style={{ marginTop: "120px", marginBottom: "60px" }}
          >
            <form onSubmit={formik.handleSubmit}>
              <Card className={styles.forgetCard}>
                <Heading subHeadingSize>
                  <b>Forgot your password?</b>
                </Heading>
                <Text smallLight>
                  Enter your register email below to get a new password
                </Text>
                {activeTab === 0 ? (
                  <>
                    <TextField
                      id="input-with-icon-textfield"
                      placeholder="Type your email"
                      name="email"
                      className={`${styles.forgetInput} black`}
                      variant="standard"
                      InputProps={{
                        disableUnderline: true,
                      }}
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.email && Boolean(formik.errors.email)
                      }
                      helperText={formik.touched.email && formik.errors.email}
                    />

                    <Button
                      size={"lg"}
                      variant="outline"
                      className={`w-100 ${styles.forgetButton}`}
                      type="submit"
                    >
                      SEND NEW PASSWORD
                    </Button>
                  </>
                ) : (
                  <>
                    <Text mediumLight className={`${styles.successMessage}`}>
                      <CheckCircleIcon /> Your new Password has been sent
                    </Text>

                    <Text smallLight>
                      Did not receive ?{" "}
                      <span
                        className={styles.loginLink}
                        onClick={() => setActiveTab(0)}
                      >
                        Resend
                      </span>
                    </Text>
                  </>
                )}
              </Card>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
