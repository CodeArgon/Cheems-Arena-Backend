import axios from "../../Routes/AxiosConfig";
import { fork, put, all, takeLatest } from "redux-saga/effects";
// Login Redux States
import {
  LOGIN,
  REGISTER_USER,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
} from "./actionTypes";
import { loginSuccess, registerUserSuccessful } from "./actions";
import { push } from "connected-react-router";
import { sagaErrorHandler } from "../../Shared/HelperMethods/SagaErrorHandler";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//If user is login then dispatch redux action's are directly from here.
function* loginUser({ payload }) {
  try {
    let data = {
      username: payload.username,
      password: payload.password,
    };
    const response = yield axios.post("login", data);
    yield put(loginSuccess(response.data));
    yield put(push("/"));
  } catch (error) {
    yield sagaErrorHandler(error.response);
  }
}

function* registerUser({ payload }) {
  try {
    let data = {
      username: payload.username,
      email: payload.email,
      password: payload.password,
      walletAddress: payload.walletAddress,
    };
    const response = yield axios.post("signup", data);
    toast.success(response.data.msg);
    yield put(registerUserSuccessful(response.data));
  } catch (error) {
    toast.error(error.response.data.data.message);
  }
}

function* forgotPasswordRequest({ payload }) {
  try {
    let data = {
      email: payload.email,
    };
    const response = yield axios.post("forgot-password", data);
    toast.success(response.data.msg);
    payload.callBack(true);
  } catch (error) {
    toast.error(error.response.data.data.message);

    // yield sagaErrorHandler(error.response);

    payload.callBack(false);
  }
}

function* resetPasswordRequest({ payload }) {
  try {
    let data = {
      email: payload.email,
      passwordResetToken: payload.passwordResetToken,
      password: payload.password,
    };
    yield axios.post("auth/admin/reset-password", data);
  } catch (error) {
    yield sagaErrorHandler(error.response);
  }
}

export function* watchLogin() {
  yield takeLatest(LOGIN, loginUser);
}
export function* watchRegister() {
  yield takeLatest(REGISTER_USER, registerUser);
}
export function* watchForgotPassword() {
  yield takeLatest(FORGOT_PASSWORD, forgotPasswordRequest);
}
export function* watchResetPassword() {
  yield takeLatest(RESET_PASSWORD, resetPasswordRequest);
}

export default function* authSaga() {
  yield all([
    fork(watchLogin),
    fork(watchRegister),
    fork(watchForgotPassword),
    fork(watchResetPassword),
  ]);
}
