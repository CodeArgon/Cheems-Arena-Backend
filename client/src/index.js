import React from "react";
import ReactDOM from "react-dom";
import { ConnectedRouter } from "connected-react-router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import "./Assets/Scss/globalStyleSheet.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "react-pro-sidebar/dist/css/styles.css";
// import reportWebVitals from "./reportWebVitals";
// import Notification from './helpers/Notifications';

import { store, persistor, history } from "./Store";

const app = (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <PersistGate persistor={persistor}>
      <ToastContainer autoClose={8000} />
        {/* <Notification /> */}
        <App />
      </PersistGate>
    </ConnectedRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
