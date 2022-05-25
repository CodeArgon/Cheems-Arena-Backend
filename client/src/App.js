import React, { Suspense, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import routes from "./Routes/AllRoutes";
import { PublicRoute } from "./Routes/PublicRoute";
import { PrivateRoute } from "./Routes/PrivateRoute";
import LoadingScreen from "./Shared/HelperMethods/LoadingScreen";
import Layout from "./Pages/Layout";

function withLayout(WrappedComponent) {
  return class extends React.Component {
    render() {
      return (
        <>
          <Layout>
            <WrappedComponent></WrappedComponent>
          </Layout>
        </>
      );
    }
  };
}

function RouteProgress(props) {
  return <Route {...props} />;
}

function App() {
  return (
    <React.Fragment>
      <Suspense fallback={<LoadingScreen />}>
        <Switch>
          {routes.map((route, i) => {
            const Component=route.component;
            return (
              <RouteProgress
                key={i}
                path={route.path}
                exact={route.exact}
                render={(props) => (
                  <>
                    {!route.ispublic? (
                      <PrivateRoute
                        props={props}
                        role={route.role}
                        Component={withLayout(Component)}
                      />
                    ):(
                      <PublicRoute props={props} Component={Component} />
                    )}
                  </>
                )}
              />
            );
          })}
        </Switch>
      </Suspense>
    </React.Fragment>
  );
}

export default App;
