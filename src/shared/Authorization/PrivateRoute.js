import React from "react";
import { Route, Redirect } from "react-router-dom";

import { Current } from "../../shared/contexts/current";
import { PATHS } from "../../utils/constants";

const PrivateRoute = ({ component: Component, current, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!current.user.isLoggedIn) return <Redirect to={PATHS.LOGIN} />;
        return <Component {...props} />;
      }}
    />
  );
};

export default Current(PrivateRoute);
