import { Layout, Modal } from "antd";
import React from "react";
import { Current } from "../contexts/current";
import { Sidebar } from "./Sidebar";
// import Footer from "./Footer";
const { confirm } = Modal;

const { Content } = Layout;

const defaultKey = "admin";

const generateItems = (actions) => [
  {
    title: "Dashboard",
    url: "/",
    key: "dashboard",
    icon: "home",
    type: "simple",
  },
  {
    title: "Utilisateurs",
    url: "/users/admin",
    key: "usersAccess",
    icon: "user",
    type: "simple",
    onlyAdmin: true,
  },
  {
    title: "Produits",
    key: "products",
    icon: "database",
    type: "cascade",
    children: [
      {
        title: "Amazon",
        url: "/products/amazon",
        key: "pamazon",
        icon: "amazon",
        type: "simple"
      },
      {
        title: "EBay",
        url: "/products/ebay",
        key: "pebay",
        icon: "shopping",
        type: "simple"
      },
      {
        title: "AliExpress",
        url: "/products/aliexpress",
        key: "paliexpress",
        icon: "alibaba",
        type: "simple"
      },
    ]
  },
  {
    title: "Déconnecter",
    action: actions.logout,
    key: "logout",
    icon: "close",
    type: "action",
  },
];

const LComponent = (WrappedComponent) =>
  Current((props) => {
    console.log("props :>> ", props);
    // console.log("props :>> ", props);
    // items = generateItems({ logout: showLogoutConfirm });

    const showLogoutConfirm = () => {
      confirm({
        title: "voulez vous vraiment vous déconnecter ?",
        onOk: () => {
          props.current.logout();
        },
      });
    };

    return (
      <Layout>
        <Layout>
          <Sidebar
            items={generateItems({ logout: showLogoutConfirm }).filter(
              ({ onlyAdmin }) =>
                !(onlyAdmin && !props.current.state.user.isAdmin)
            )}
            defaultKey={defaultKey}
          />
          <Layout>
            <Content
              style={{
                padding: 24,
                margin: 0,
                height: "80vh",
              }}
            >
              <WrappedComponent {...props} />
            </Content>
            {/* <Footer /> */}
          </Layout>
        </Layout>
      </Layout>
    );
  });

export default LComponent;
