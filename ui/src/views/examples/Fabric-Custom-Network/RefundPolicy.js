import React from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText } from 'reactstrap';

const RefundPolicy = () => {
  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <Card>
            <CardBody>
              <CardTitle tag="h2">Refund Policy</CardTitle>
              <CardText>
                <p>Thank you for shopping at pavantechacademy.graphy.com</p>

                <h4>Non-tangible irrevocable goods ("Digital products")</h4>
                <p>
                  We do not issue refunds for non-tangible irrevocable goods ("digital products")
                  once the order is confirmed and the product is sent. We recommend contacting us
                  for assistance if you experience any issues receiving or downloading our products.
                </p>

                <h4>Contact Us for Any Issues</h4>
                <p>
                  If you have any questions about our Returns and Refunds Policy, please contact us at:
                  <a href="mailto:pavantechacademy@gmail.com"> pavantechacademy@gmail.com</a>
                </p>
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RefundPolicy;