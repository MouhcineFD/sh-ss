import { Layout } from "antd";
import React from "react";
import { SideMenu } from "../SideMenu";
import "./styles.css";

export class Sidebar extends React.Component {
  state = {
    collapsed: false,
  };

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  render() {
    return (
      <Layout.Sider
        theme="dark"
        collapsible
        collapsed={this.state.collapsed}
        onCollapse={this.onCollapse}
        className="sider"
      >
        <div className="brand">
          <text className="brand-title">HELLO</text>
        </div>
        <div className="menuContainer">
          <SideMenu {...this.props} />
        </div>
      </Layout.Sider>
    );
  }
}
