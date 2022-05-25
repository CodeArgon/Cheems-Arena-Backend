import LockIcon from "@mui/icons-material/Lock";
import MailIcon from "@mui/icons-material/Mail";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import Button from "../../../Shared/Button/Button";
import ProfileCard from "../../../Shared/ProfileCard/Card";
import Text from "../../../Shared/Text/Text";
import Heading from "../../../Shared/Heading/Heading";
// import { Link } from "react-router-dom";
// import { Form, FormikProvider } from "formik";
import { loginUser } from "../../../Store/Auth/actions";
import { useHistory, Link } from "react-router-dom";
import ArrowIcon from "../../../Assets/Images/arrow_back.png";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import styles from "./style.module.scss";

export default function Profile(props) {
  const [activeTab, setActiveTab] = useState(0);
  const dispatch = useDispatch();
  const history = useHistory();

  const loginUserSchema = Yup.object().shape({
    email: Yup.string()
      .email("Please enter valid email address")
      .required("Please enter email address"),
    password: Yup.string().required("Please enter password"),
  });
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    enableReinitialize: true,
    validationSchema: loginUserSchema,
    onSubmit: async (values) => {
      await dispatch(
        loginUser({
          email: "ajmal@mail.com",
          password: "1234",
          resetForm: formik.resetForm,
          //   history: history,
        })
      );
    },
  });
  return (
    <div className={styles.profileScreen}>
      <div className={styles.arrowImage}>
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
      </div>
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-md-4">
            <ProfileCard className={styles.profileCard}>
              <Heading subHeadingSize className={styles.changeProfileButton}>
                Change profile picture
              </Heading>

              <TextField
                id="input-with-icon-textfield"
                placeholder="User Name"
                className={`${styles.profileInput}`}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <CheckCircleIcon sx={{ color: "#A0D46B !important" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                id="input-with-icon-textfield"
                placeholder="Email"
                className={`${styles.profileInput}`}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <EditIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                id="input-with-icon-textfield"
                placeholder="Password"
                className={`${styles.profileInput}`}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <EditIcon edge="end" />
                    </InputAdornment>
                  ),
                }}
              />
            </ProfileCard>
          </div>
        </div>
      </div>
    </div>
  );
}
