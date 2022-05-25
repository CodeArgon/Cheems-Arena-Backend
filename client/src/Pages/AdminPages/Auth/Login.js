import React from "react";
// import { Link } from "react-router-dom";
// import { Form, FormikProvider } from "formik";
import { loginUser } from "../../Store/Auth/actions";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../../Shared/Button/Button";
import Card from "../../Shared/Card/Card";
import Text from "../../Shared/Text/Text";
import Heading from "../../Shared/Heading/Heading";
import InputField from "../../Shared/InputField";
import SelectField from "../../Shared/SelectField/SelectField";

export default function Login(props) {
  const dispatch = useDispatch();
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
    <div className="socialAppLogin">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6">
            <Card className="">
              <Button size={"sm"} variant="outline">
                helo
              </Button>
              <Text mediumLight>hey my name is jimmy</Text>
              <Heading subHeadingSize>Create Admin</Heading>
              <InputField placeholder="Enter first name" />
              <SelectField />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
