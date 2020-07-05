import { Divider, Icon, Row } from "antd";
import React, { Fragment } from "react";
import List from "./List";

export default (props) => (
  <Fragment>
    <Row style={{ marginBottom: 10 }}>
      <Icon className="header-left-content-icon" type="message" />
      <span className="header-left-content-text">Administrateurs</span>
    </Row>
    <div style={{ height: "40vh" }}>
      <List {...props} />
    </div>
    <Divider />
  </Fragment>
);
