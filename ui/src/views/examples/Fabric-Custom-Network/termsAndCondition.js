import React from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText } from 'reactstrap';
const termsAndCondition = () => {
  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <Card>
            <CardBody>
              <CardTitle tag="h2">Terms of Use</CardTitle>
              <CardText>
                <p>
                  These Terms of Use set out the terms and conditions for use of this Blocktech Media (“Website”) and any content, Public Forums, or services offered on or through the Website and/or through any mobile application(s) (“Application”) (collectively referred to as the “Platform”).
                </p>
                <p>
                  These Terms of Use apply to end users of the Website (referred to as “Learners”, “You”, “Your”). These Terms of Use, including the Privacy Policy and any other terms and conditions published on the Platform or communicated to you from time to time (collectively referred to as the “Agreement”), define the relationship and responsibilities between You and Creator (as defined herein) in using the Platform. Your access to the Platform is subject to Your acceptance of this Agreement. Hence, please take Your time to read this Agreement.
                </p>
                <p>
                  When we speak of “Creator”, ‘we’, ‘us’, and ‘our’, we collectively mean Blocktech Media being the creator of this Platform and the content/materials/services contained therein. By accessing this Platform, You are agreeing to be bound by the terms of this Agreement, all applicable laws and regulations.
                </p>
                <p>
                  From time-to-time, versions of the above-mentioned policies and terms are made available on the Platform for Your reference and to understand how we handle Your personal information. By using or visiting the Platform and services provided to You on, from, or through the Platform, You are expressly agreeing to the terms of the Agreement and any other terms that are updated from time to time.
                </p>
                <h4>Access and Registration</h4>
                <p>
                  If You’re an individual You must be at least 18 (eighteen) years of age, or, if You are between the ages of 13 and 18, You must have Your parent or legal guardian's permission to use the Platform. By using the Platform, You are representing and warranting to us that You have obtained the appropriate consents/permissions to use the Platform.
                </p>
                <h4>License to Use</h4>
                <p>
                  You are granted a limited, non-exclusive license to access and view the Content on the Platform for Your own personal, non-commercial use only. This license does not grant You the right to assign or sublicense.
                </p>
                <h4>Communications</h4>
                <p>
                  The Platform includes provision and facilitation of Public Forums designed to enable You to communicate with us and other registrants.
                </p>
                <h4>Code of Conduct</h4>
                <p>You agree to use the Platform only for lawful purposes.</p>
                <h4>Intellectual Property</h4>
                <p>
                  We own all information and materials provided or communicated to You by or on behalf of us including but not limited to trademarks, logos, etc.
                </p>
                <h4>Feedback</h4>
                <p>If you submit suggestions or questions containing product feedback about any Content, you grant us rights.</p>
                {/* Add more sections as needed based on your content */}

              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
export default termsAndCondition;