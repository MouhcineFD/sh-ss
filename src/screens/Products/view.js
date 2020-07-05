import { Divider, Icon, Row } from "antd";
import React, { Fragment } from "react";
import List from "./Units/List";

export default (props) => (
  <Fragment>
    <Row style={{ marginBottom: 10 }}>
      <Icon className="header-left-content-icon" type="database" />
      <span className="header-left-content-text">Produits</span>
    </Row>
    <div style={{ height: "40vh" }}>
      <List {...props} />
    </div>
    <Divider />
  </Fragment>
);
