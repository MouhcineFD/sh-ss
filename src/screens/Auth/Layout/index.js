import { Col, Row } from "antd";
import React from "react";
import "./style.css";

export default (WrappedComponent) =>
  class AuthLayout extends React.Component {
    render() {
      return (
        <div className="root">
          <Row>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <div className="left-container">
                <div className="left-content">
                  <p className="header-text-2">
                    Bienvenue sur votre plateforme d'analyse des produits
                  </p>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <div className="right-container">
                <div className="right-content">
 
                  <div className="right-content-body">
                    <WrappedComponent {...this.props} />
                  </div>


                </div>
              </div>
            </Col>
          </Row>
        </div>
      );
    }
  };
