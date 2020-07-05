import Dashboard from "./Dashboard";
import Layout from "./../../shared/components/Layout";
import PrivateRoute from "./../../shared/Authorization/PrivateRoute";


const routes = [
  {
    path: "/",
    exact: true,
    component: Dashboard
  }
];

export default routes.map(({ component: Component, ...rest }) => ({
  component: () =>
    PrivateRoute({ component: Layout(Component) }),
  ...rest
}));
