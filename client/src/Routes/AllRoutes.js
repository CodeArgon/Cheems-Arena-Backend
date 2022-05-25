import { lazy } from "react";
import fakeDelay from "../Shared/HelperMethods/FakeDelay";

const delayTime = 2000;

const routes = [
 
  // {
  //   path: "/",
  //   component: lazy(() => fakeDelay(delayTime)(import("../Pages/Auth/Login"))),
  //   ispublic: true,
  //   exact: true,
  // },
  {
    path: "/signup",
    component: lazy(() => fakeDelay(delayTime)(import("../Pages/Auth/SignUp"))),
    ispublic: true,
    exact: true,
  },
  {
    path: "/forget-password",
    component: lazy(() => fakeDelay(delayTime)(import("../Pages/Auth/ForgotPassword"))),
    ispublic: true,
    exact: true,
  },
  // {
  //   path: "/profile",
  //   component: lazy(() => fakeDelay(delayTime)(import("../Pages/Auth/Profile"))),
  //   ispublic: true,
  //   exact: true,
  // },
  // { path: '/*', component: Error404, role: [1, 3, 4, 5] }
];

export default routes;
