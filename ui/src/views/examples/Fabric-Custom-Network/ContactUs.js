import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  Spinner
} from 'reactstrap';
const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('sending');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      {/* Header */}
      {/* <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            <Row>
              <Col className="text-center text-white">
                <h1 className="display-2">Contact Us</h1>
                <p className="mt-3">
                  Have questions? We'd love to hear from you. Send us a message
                  and we'll respond as soon as possible.
                </p>
              </Col>
            </Row>
          </div>
        </Container>
      </div> */}
      {/* Page content */}
      <Container className="mt--7" fluid>

        <Row className="justify-content-center">
          <Col lg="8" md="10">
            <Card className="bg-secondary shadow border-0">
              <CardBody className="px-lg-5 py-lg-5">
              <h1 className="display-2">Contact Us</h1>
               <p className="mt-3">
                  Have questions? We'd love to hear from you. Send us a message
                  and we'll respond as soon as possible.
                </p>
                {submitStatus === 'success' && (
                  <Alert color="success" className="mb-4">
                    Thank you for your message! We'll get back to you soon.
                  </Alert>
                )}
                {submitStatus === 'error' && (
                  <Alert color="danger" className="mb-4">
                    There was an error sending your message. Please try again.
                  </Alert>
                )}
                <Form role="form" onSubmit={handleSubmit}>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label>Full Name *</Label>
                        <Input
                          placeholder="Enter your full name"
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label>Email Address *</Label>
                        <Input
                          placeholder="Enter your email address"
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <FormGroup>
                    <Label>Phone Number</Label>
                    <Input
                      placeholder="Enter your phone number"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Message *</Label>
                    <Input
                      placeholder="How can we help you?"
                      type="textarea"
                      name="message"
                      rows="4"
                      required
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <div className="text-center">
                    <Button
                      className="my-4"
                      color="primary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner size="sm" className="mr-2" />
                          Sending...
                        </>
                      ) : 'Send Message'}
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
          {/* Contact Information */}
          <Col lg="4" md="10" className="mt-4 mt-lg-0">
            <Card className="bg-secondary shadow border-0">
              <CardBody className="p-lg-5">
                <h4 className="mb-4">Contact Information</h4>
                {/* <div className="mb-4">
                  <h6 className="text-primary">Office Address</h6>
                  <p className="text-muted mb-0">
                    123 Business Street<br />
                    Suite 100<br />
                    City, State 12345<br />
                    In
                  </p>
                </div> */}
                <div className="mb-4">
                  <h6 className="text-primary">Contact Details</h6>
                  <p className="text-muted mb-0">
                    Email: pavantechacademy@gmail.com<br />
                    Phone: +91 8390114357
                  </p>
                </div>
                <div>
                  <h6 className="text-primary">Business Hours</h6>
                  <p className="text-muted mb-0">
                    Monday - Friday<br />
                    9:00 AM - 5:00 PM EST
                  </p>
                </div>
                {/* Social Links */}
                {/* <div className="mt-4 pt-4 border-top">
                  <div className="d-flex justify-content-around">
                    <Button color="info" className="btn-icon-only rounded-circle">
                      <span className="btn-inner--icon">
                        <i className="fab fa-twitter" />
                      </span>
                    </Button>
                    <Button color="info" className="btn-icon-only rounded-circle">
                      <span className="btn-inner--icon">
                        <i className="fab fa-facebook" />
                      </span>
                    </Button>
                    <Button color="info" className="btn-icon-only rounded-circle">
                      <span className="btn-inner--icon">
                        <i className="fab fa-instagram" />
                      </span>
                    </Button>
                  </div>
                </div> */}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default ContactUs;