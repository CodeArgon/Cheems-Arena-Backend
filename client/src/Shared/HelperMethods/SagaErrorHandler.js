import { put } from "redux-saga/effects";
import { push } from "connected-react-router";

// import { logout } from "../Store/actions";
// import { setNotification } from "../store/actions";

export function* sagaErrorHandler(error) {
  if (error.status === 401 || error.status === 403) {
    yield put(push("/adminposts"));
    // yield put(
    //         setNotification({
    //         status: "error",
    //         data: { message: "Your current session has expired! Please login again to continue." },
    //         })
    //     );
    // yield put(logout());
  } else {
    // yield put(
    //     setNotification({
    //     status: "error",
    //     data: { message: error.data.message },
    //     })
    // );
  }
}
