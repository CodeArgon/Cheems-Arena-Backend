import React from "react";
import { Link } from "react-router-dom";
// import { Row, Col, Button } from 'reactstrap';
// import loginSagas from './redux/saga';
import { Form, FormikProvider } from "formik";
// import InputField from '../../shared/InputField';
// import { loginAction } from './redux/actions';
// import { useInjectSaga } from '../../../utils/injectSaga';
import { loginUser } from "../Store/Auth/actions";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
// import "./style.scss";

export default function Login(props) {
  // const { history } = props;
  //   useInjectSaga({ key: 'loginSagas', saga: loginSagas });
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
          email: values.email,
          password: values.password,
          resetForm: formik.resetForm,
          history: history,
        })
      );
    },
  });
  return (
    <div className="socialAppLogin">
      <div className="container-fluid">
        {/* <Row className="full-height-row align-items-center">
          <Col className="full-height-block bg-dark-blue"> */}
        <div className="">
          <div className="p-3">
            <div>
              <div className="text-right">
                <Link
                  to="/SignUp"
                  className="btn-rounded btn-outline-primary btn w-md waves-effect waves-light"
                >
                  Sign up
                </Link>
              </div>
              <div className="text-left p-3">
                <h4 className="font-24 text-center text-uppercase">Welcome!</h4>
                <p className="font-18 text-center">
                  Sign in to Your Social App
                </p>
                <FormikProvider value={formik}>
                  <Form noValidate onSubmit={formik.handleSubmit}>
                    <input
                      placeholder="Email"
                      type="text"
                      className="form-control"
                      name="email"
                      value={formik.values && formik.values.email}
                      onChange={formik.handleChange}
                    />
                    <input
                      placeholder="Enter Password"
                      type="password"
                      className="form-control"
                      name="password"
                      value={formik.values && formik.values.password}
                      onChange={formik.handleChange}
                    />
                    <button type="submit">Sign In</button>
                  </Form>
                </FormikProvider>
              </div>
            </div>
          </div>
        </div>
        {/* </Col>
        </Row> */}
      </div>
    </div>
  );
}
