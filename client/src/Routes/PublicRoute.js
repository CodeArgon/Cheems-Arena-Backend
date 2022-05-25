import React from "react";
import { Redirect } from "react-router-dom";
// import { useSelector } from "react-redux";

export function PublicRoute({ Component, props }) {
  // const token = useSelector((state) => state.Auth.token);
  const token = null;
  if (token) {
    return <Redirect to="/dashboard" />;
  } else {
    return <Component {...props} />;
  }
}
