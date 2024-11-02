// import React from 'react'

// export default function PrivacyPolicy() {
//   return (
//     <div>PrivacyPolicy</div>
//   )
// }

import React from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText } from 'reactstrap';

const PrivacyPolicy = () => {
  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <Card>
            <CardBody>
              <CardTitle tag="h2">Privacy Policy</CardTitle>
              <CardText>
                <h4>Introduction</h4>
                <p>
                  Your privacy is important to us. This privacy policy explains how we collect,
                  use, and protect your information when you visit our website.
                </p>

                <h4>Information We Collect</h4>
                <p>
                  We may collect personal information such as your name, email address, and other
                  details when you register on our site or fill out a form.
                </p>

                <h4>How We Use Your Information</h4>
                <p>
                  We use the information we collect to improve our services, respond to inquiries,
                  and send periodic emails regarding your order or other products and services.
                </p>

                <h4>Protection of Your Information</h4>
                <p>
                  We implement a variety of security measures to maintain the safety of your
                  personal information. However, no method of transmission over the Internet or
                  method of electronic storage is 100% secure.
                </p>

                <h4>Cookies</h4>
                <p>
                  Our site may use "cookies" to enhance user experience. Users can choose to set
                  their web browser to refuse cookies or to alert them when cookies are being sent.
                </p>

                <h4>Your Consent</h4>
                <p>
                  By using our site, you consent to our privacy policy.
                </p>

                <h4>Changes to Our Privacy Policy</h4>
                <p>
                  We may update this privacy policy from time to time. We will notify you about
                  significant changes in the way we treat personal information by sending a notice
                  to the primary email address specified in your account or by placing a prominent
                  notice on our site.
                </p>

                <h4>Contact Us</h4>
                <p>If you have any questions about this privacy policy, please contact us.</p>
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PrivacyPolicy;