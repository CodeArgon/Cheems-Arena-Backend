import produce from "immer";
import { REGISTER_USER_SUCCESSFUL, LOGIN_SUCCESS, LOGOUT } from "./actionTypes";

const initialState = {
  user: null,
  token: null,
};

const Auth = produce((state, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      state.user = action.payload;
      state.token = action.payload.accessToken;
      break;
    case REGISTER_USER_SUCCESSFUL:
      state.user = action.payload.user;
      state.token = action.payload.accesToken;
      break;
    case LOGOUT:
      state.user = null;
      state.token = null;
      break;
    default:
      break;
  }
}, initialState);

export default Auth;
