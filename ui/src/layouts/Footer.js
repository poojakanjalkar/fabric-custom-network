import React from "react";
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import AuthNavbar from "../components/Navbars/AuthNavbar.js";
import AuthFooter from "../components/Footers/AuthFooter.js";
import PrivacyPolicy from "views/examples/Fabric-Custom-Network/PrivacyPolicy.js";
import termsAndCondition from "views/examples/Fabric-Custom-Network/termsAndConditions.js";
import RefundPolicy from "views/examples/Fabric-Custom-Network/RefundPolicy.js";
import ContactUs from "views/examples/Fabric-Custom-Network/ContactUs.js";
import '@fortawesome/fontawesome-free/css/all.min.css';


const FooterLayout = () => {
    const location = useLocation();
  return (
    <>
      <div className="main-content header bg-gradient-info">
        <Container>
              <div className="header-body text-center mb-7">
                <Row className="justify-content-center "  lg="8" md="6">
                    
                  <Col className="mt-6" lg="5" md="6">
                      <h1 className="text-white mt 5">
                        Welcome to Hyperledger Fabric Custom Network!
                      </h1>
                  </Col>
                </Row>
              </div>
            </Container>
        <AuthNavbar />
        <Container className="mt-7 pb-5">
          <Row className="justify-content-center px-3">
         
            <Switch location={location}>
              <Route
                path="/privacy-policy"
                exact
                component={PrivacyPolicy}
              />
              <Route
                path="/terms-and-conditions"
                exact
                component={termsAndCondition}
              />
              <Route
                path="/refund-policy"
                exact
                component={RefundPolicy}
              />
              <Route
                path="/contact-us"
                exact
                component={ContactUs}
              />
              {/* <Redirect from="*" to="/auth/login" /> */}
             
            </Switch>
          </Row>
        </Container>
      </div>
      <AuthFooter />
    </>
  );
};

export default FooterLayout;