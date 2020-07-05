import React from "react";
import { Switch } from "react-router-dom";
import { renderRoutes } from "react-router-config";

import screens from "./../screens";
import { Current } from "./../shared/contexts/current";

const View = () => {
  return <Switch>{renderRoutes(screens)}</Switch>;
};

export default Current(View);
