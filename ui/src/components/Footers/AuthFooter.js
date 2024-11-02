/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
/*eslint-disable*/
import React from "react";

// reactstrap components
import { NavItem, NavLink, Nav, Container, Row, Col } from "reactstrap";

class Login extends React.Component {
  render() {
    return (
      <>
        <footer className="py-5">
        <Container>
            <Row className="align-items-center justify-content-xl-between">
              {/* <Col xl="2">
                <div className="copyright text-center text-xl-left text-muted">
                  © 2020{" "}
                  <a
                    className="font-weight-bold ml-1"
                    href="https://www.linkedin.com/in/pavan-adhav/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Adhav Pavan
                  </a>
                </div>
              </Col> */}
              <Col xl="12">
                <Nav className="nav-footer justify-content-center ">
                  <a
                    href="/auth/contact-us"
                    className="text-gray-600 hover:text-gray-900 mx-3"
                  >
                    Contact Us
                  </a>

                  <a
                    href="/auth/privacy-policy"
                    className="text-gray-600 hover:text-gray-900  mx-3"
                  >
                    Privacy Policy
                  </a>
                  <a
                    href="/auth/terms-and-conditions"
                    className="text-gray-600 hover:text-gray-900 mx-3"
                  >
                    Terms and Condition
                  </a>
                  <a
                    href="/auth/refund-policy"
                    className="text-gray-600 hover:text-gray-900 mx-3"
                  >
                    Refund Policy
                  </a>
                </Nav>
              </Col>
            </Row>
          </Container>
        </footer>
      </>
    );
  }
}

export default Login;
