import {
  LOGIN,
  LOGIN_SUCCESS,
  REGISTER_USER,
  REGISTER_USER_SUCCESSFUL,
  LOGOUT,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
} from "./actionTypes";

export const loginUser = (data) => {
  return {
    type: LOGIN,
    payload: data,
  };
};

export const loginSuccess = (data) => {
  return {
    type: LOGIN_SUCCESS,
    payload: data,
  };
};

export const registerUser = (data) => {
  return {
    type: REGISTER_USER,
    payload: data,
  };
};

export const registerUserSuccessful = (data) => {
  return {
    type: REGISTER_USER_SUCCESSFUL,
    payload: data,
  };
};

export const forgotPassword = (data) => {
  return {
    type: FORGOT_PASSWORD,
    payload: data,
  };
};

export const resetPassword = (data) => {
  return {
    type: RESET_PASSWORD,
    payload: data,
  };
};

export const logout = () => {
  return {
    type: LOGOUT,
  };
};
