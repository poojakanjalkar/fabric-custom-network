import React, { useEffect, useState } from "react";
// import Razorpay from 'razorpay';

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
// core components
import UserHeader from "../../components/Headers/UserHeader.js";
// import { useSelector } from 'react-redux';
import { connect } from "react-redux";
import axios from "axios";
import { routes, headers } from "../../helper/config.js";
import ProgressBar from "./ProgressBar.js";
// import Razorpay from 'razorpay';

class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      credit: 'Loading...',
      isLoading:false
    };
  }

  componentDidMount() {

  axios.get(`${routes.credits}`, headers())
      .then(response => {
        // Set the response data to the component state
        this.setState({ data: response.data, loading: false });
        let userdata = JSON.parse(localStorage.getItem("user-data"))
        userdata.subscription = response?.data?.payload
        // localStorage.setItem()
        localStorage.setItem('user-data',JSON.stringify(userdata))
        this.setState({credit: response?.data?.payload?.credit || 0 })
        console.log("-----------------", response.data)
      })
      .catch(error => {
        // Handle any errors and update the state
        this.setState({ error: error.message, loading: false });
      });
  }

  loadScript = (src) => {
    return new Promise((resovle) => {
      const script = document.createElement("script");
      script.src = src;

      script.onload = () => {
        resovle(true);
      };

      script.onerror = () => {
        resovle(false);
      };

      document.body.appendChild(script);
    });
  };

  // razorpay = new Razorpay();

  startPayment = async () => {
    this.setState((prevState) => ({
      ...prevState, // Spread the existing state
      isLoading: true, // Update isLoading
    }));
    const res = await this.loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("You are offline... Failed to load Razorpay SDK");
      return;
    }

    let payload = {
      // currency:'INR',
      currency: "USD",
      amount: 29 ,
      receipt:"Reciept-122"
    }

    try {
      const orderResponse = await axios.post(`${routes.getOrderId}`,payload, headers())

      let order = orderResponse.data.payload

      console.log("---------orderResponse---------", orderResponse)
      // return

      const options = {
        key:orderResponse.key,
        // currency:'INR',
        currency: orderResponse?.currency || "USD",
        amount: orderResponse?.amount || 30,
        name: "Morya Innovations",
        description: "Thanks for purchasing",
        order_id: order.orderId,
        customer: {
          name: JSON.parse(localStorage.getItem("user-data")).name,
          email: JSON.parse(localStorage.getItem("user-data")).email,
        },
        handler: async  (response) => {
          // alert(response.razorpay_payment_id);
          // alert("Payment Successfully");
          // routes
          console.log("++++++++++*******+++++*****+++++");
          let subscription = await axios.get(
            `${routes.credits}`,
            headers()
          );
          console.log(
            "_______get subscription creditttt_____________",
            subscription.data
          );
  
          let userdata = JSON.parse(localStorage.getItem("user-data"))
          userdata.subscription = subscription?.data?.payload
          localStorage.setItem('user-data',JSON.stringify(userdata))
  
          // this.setState({credit: subscription?.data?.payload?.credit || 0 })

          this.setState((prevState) => ({
            ...prevState, // Spread the existing state
            credit: subscription?.data?.payload?.credit || 0, // Update isLoading
          }));
  

        },
        notes: {
          name: JSON.parse(localStorage.getItem("user-data")).name,
          email: JSON.parse(localStorage.getItem("user-data")).email,
        },
        prefill: {
          name: "Morya Innovations",
        },
      };

      this.setState((prevState) => ({
        ...prevState, // Spread the existing state
        isLoading: false, // Update isLoading
      }));
  
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      
    } catch (error) {

      this.setState((prevState) => ({
        ...prevState, // Spread the existing state
        isLoading: false, // Update isLoading
      }));
      
    }



  };

  render() {
    return (
      <>
        <UserHeader />
        {/* Page content */}
        <Container className="mt--7" fluid>
        {this.state.isLoading? <ProgressBar/> :
          <Row>
            <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
              <Card className="card-profile shadow">
                <Row className="justify-content-center">
                  <Col className="order-lg-2" lg="3">
                    <div className="card-profile-image">
                      {/* <a href="#pablo" onClick={e => e.preventDefault()}>
                        <img
                          alt="..."
                          className="rounded-circle"
                          src={require("../../assets/img/theme/team-4-800x800_1.jpg")}
                        />
                      </a> */}
                    </div>
                  </Col>
                </Row>
                <CardBody className="pt-0 pt-md-4 mt-5">
                  <Form>
                    <h6 className="heading-small text-muted mb-4">
                      Subscription
                    </h6>
                    <h6 className="heading-small text-muted mb-4">
                      <div className="h5 font-weight-300">
                        <i className="ni location_pin mr-2" />
                        {` Remaining Credit - ${
                          this.state.credit
                          // JSON.parse(localStorage.getItem("user-data"))?.subscription?.credit
                        }`}

                        {/* {` Total Credit - ${credit}`} */}
                      </div>
                      <div className="h5 font-weight-300">
                        <i className="ni location_pin mr-2" />
                        {/* {` Used Credit - ${creditUsed}`} */}
                      </div>
                      {/* <div className='h5 font-weight-300'>
                        <i className='ni location_pin mr-2' />
                        {` Balance Credit - 10`}
                      </div> */}
                    </h6>

                    <Button
                      color="info"
                      href="#pablo"
                      onClick={(e) => this.startPayment()}
                    >
                      Buy Credit
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
            <Col className="order-xl-1" xl="8">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">My account</h3>
                    </Col>
                    <Col className="text-right" xs="4">

                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form>
                    <h6 className="heading-small text-muted mb-4">
                      User information
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-username"
                            >
                              Name
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue="lucky.jesse"
                              id="input-username"
                              placeholder="Username"
                              type="text"
                              value={
                                JSON.parse(localStorage.getItem("user-data"))
                                  .name
                              }
                              disabled={true}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-email"
                            >
                              Email address
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-email"
                              placeholder="jesse@example.com"
                              type="email"
                              value={
                                JSON.parse(localStorage.getItem("user-data"))
                                  .email
                              }
                              disabled={true}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <hr className="my-4" />
                    {/* Address */}
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
          }
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  decodedData: state?.User?.login?.decodedData, // Replace with the actual state key
});

// export default Profile;

export default connect(mapStateToProps)(Profile);
