import View from "./view";
import Layout from "./../../../shared/components/Layout";
import PrivateRoute from "./../../../shared/Authorization/PrivateRoute";

const routes = [
  {
    path: "/users/admin",
    exact: true,
    component: View
  }
];

export default routes.map(({ component: Component, ...rest }) => ({
  component: () => PrivateRoute({ component: Layout(Component) }),
  ...rest
}));
