// @flow
import { Icon, Menu } from "antd";
import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import "./styles.css";

const { SubMenu, Item } = Menu;

export class SideMenu extends Component {
  state = {
    collapsed: false,
    current: this.props.defaultKey
  };

  onCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  handleClick = e => {
    this.setState({
      current: e.key
    });
  };

  renderAction = ({ title, key, icon, action }) => {
    return (
      <Item key={key} onClick={action}>
        <Icon type={icon} />
        <span>{title}</span>
      </Item>
    );
  };

  renderSimple = ({ url, title, key, icon }) => {
    return (
      <Item key={key}>
        <Link to={url}>
          <Icon type={icon} />
          <span>{title}</span>
        </Link>
      </Item>
    );
  };

  renderCascade = ({ url, title, key, icon, children }) => (
    <SubMenu
      key={key}
      title={
        url ? (
          <Fragment>
            <Icon type={icon} />
            <Link to={url} style={{ textDecoration: "none" }}>
              {title}
            </Link>
          </Fragment>
        ) : (
          <Fragment>
            <Icon type={icon} />
            <span>{title}</span>
          </Fragment>
        )
      }
    >
      {children.map(child => (
        <Item key={child.key}>
          <Link to={child.url}>
            <Icon type={child.icon} />
            <span>{child.title}</span>
          </Link>
        </Item>
      ))}
    </SubMenu>
  );

  render = () => {
    return (
      <Menu
        theme="dark"
        defaultSelectedKeys={[this.props.defaultKey]}
        mode="inline"
      >
        {this.props.items.map(item => {
          const Widget =
            item.type === "simple"
              ? this.renderSimple(item)
              : item.type === "cascade"
              ? this.renderCascade(item)
              : this.renderAction(item);
          return Widget;
        })}
      </Menu>
    );
  };
}
