// import React from 'react'

// export default function AboutUs() {
//   return (
//     <div>
//       <p>{"Pavan-----------------------------------------"}</p>
//     </div>
//   )
// }


import React from "react";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";

class AboutUs extends React.Component {
  render() {
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col className="mb-5 mb-xl-0" xl="12">
              <Card className="bg-white shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">About Us</h3>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  {/* Your About Us content here */}
                  <p className="description">
                    Welcome to our platform. We are dedicated to providing...
                  </p>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default AboutUs;