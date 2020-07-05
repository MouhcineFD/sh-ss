import PrivateRoute from "./../../shared/Authorization/PrivateRoute";
import Layout from "./../../shared/components/Layout";
import Detail from "./Units/Detail";
import View from "./view";

const routes = [
  {
    path: "/products/:brand",
    exact: true,
    component: View,
  },
  {
    path: "/product/:id",
    exact: true,
    component: Detail,
  },
];

export default routes.map(({ component: Component, ...rest }) => ({
  component: () => PrivateRoute({ component: Layout(Component) }),
  ...rest,
}));
