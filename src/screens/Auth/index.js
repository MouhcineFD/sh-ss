import Register from "./Register";
import Layout from "./Layout";
import Login from "./Login";

const routes = [
  {
    path: "/login",
    exact: true,
    component: Login,
  },
  {
    path: "/register",
    exact: true,
    component: Register,
  },
];

export default routes.map(({ component: Component, ...rest }) => ({
  component: Layout(Component),
  ...rest,
}));
