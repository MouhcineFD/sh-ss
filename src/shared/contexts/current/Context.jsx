import isEmpty from "lodash/isEmpty";
import propTypes from "prop-types";
import React, { Component } from "react";
import { withRouter } from "react-router";
import { api } from "../../http";
import { PATHS } from "./../../../utils/constants";
// Context
export const Context = React.createContext("current");
export const { Consumer } = Context;

// Provider
class ProviderComponent extends Component {
  constructor(props) {
    super(props);

    const state = {};
    try {
      state.user = JSON.parse(localStorage.getItem("current")) || {};
      if (!isEmpty(state.user)) api.setAccessToken(state.user.authorization);
    } catch (e) {
      state.user = {};
    }
    this.state = state;
  }

  get user() {
    return this.state.user;
  }

  setUser = (user) =>
    new Promise((resolve) => {
      this.setState({ user }, () => {
        localStorage.setItem("current", JSON.stringify(user));
        api.setAccessToken(user.authorization);
        return resolve();
      });
    });

  reset = () => this.setUser({});

  init() {
    if (this.state.user.isLoggedIn) return;
    this.reset();
    return this.props.history.push(PATHS.LOGIN);
  }

  logout() {
    localStorage.removeItem("current");
    this.props.history.push(PATHS.LOGIN);
  }

  render() {
    return (
      <Context.Provider value={this}>{this.props.children}</Context.Provider>
    );
  }
}

ProviderComponent.propTypes = {
  children: propTypes.element.isRequired,
  history: propTypes.shape({
    push: propTypes.func,
  }).isRequired,
};

export const Provider = withRouter(ProviderComponent);
