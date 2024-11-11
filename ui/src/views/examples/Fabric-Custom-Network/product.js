import React, { useEffect } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
    CardText,
    Button,
    ListGroup,
    ListGroupItem
} from 'reactstrap';

export default function Component() {

    const loadScript = (src) => {
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


    const startPayment = async (name, email) => {
        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );

        if (!res) {
            alert("You are offline... Failed to load Razorpay SDK");
            return;
        }

        const options = {
            key: "rzp_live_DghPaxyb1sOnGp",
            currency: 'INR',
            currency: "USD",
            amount: 30 * 100,
            name: "Morya Innovation",
            description: "Thanks for purchasing",
            customer: {
                name: name,
                email: email,
            },
            handler: async function (response) {
            },
            notes: {
                name: JSON.parse(localStorage.getItem("user-data")).name,
                email: JSON.parse(localStorage.getItem("user-data")).email,
            },
            prefill: {
                name: "Morya Innovation",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    const features = [
        "1. Create custom Hyperledger Fabric networks",
        "2. Add any number of organizations",
        "3. Customize organization names",
        "4. Create multiple channels",
        "5. Deploy multiple chaincodes",
        "6. Generate boilerplate code for:",
        "    - Blockchain network",
        "    - API",
        "    - Hyperledger Explorer",
        "    - Hyperledger Caliper"
    ];

    return (
        <Container className="py-15">
            <Row className="mb-5">
                {/* <Card> */}
                <Col>
                    <h1 className="display-4 text-center text-white mb-4">Build your custom Hyperledger Fabric network with ease. Perfect for developers and enterprises.</h1>
                </Col>
                {/* </Card> */}
            </Row>

            <Row className="mb-5">
                <Col md={8}>
                    <Card>
                        <CardBody>
                            <CardTitle tag="h3">Platform Features</CardTitle>
                            <ListGroup flush>
                                {features.map((feature, index) => (
                                    <ListGroupItem className='bold' key={index}>{feature}</ListGroupItem>
                                ))}
                            </ListGroup>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="bg-white">
                        <CardBody className="text-center">
                            <CardTitle tag="h3">Pricing</CardTitle>
                            <CardText className="display-4 my-4">$30</CardText>
                            <CardText>One-time purchase</CardText>
                            <form className="space-y-4" onSubmit={(e) => {
                                e.preventDefault(); // Prevent default form submission
                                const name = e.target.name.value;
                                const email = e.target.email.value;
                                startPayment(name. email); // Call the payment function only when validation passes
                            }}>
                                <div>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Your Name"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                                <Button type="submit" color="primary" size="lg" className="mt-3">
                                    Buy Now
                                </Button>
                            </form>


                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            <CardTitle tag="h3">Why Choose Our Platform?</CardTitle>
                            <CardText>
                                Our Hyperledger Fabric Network Creator empowers you to build custom blockchain networks tailored to your specific needs. With our intuitive platform, you can:
                            </CardText>
                            <ListGroup flush>
                                <ListGroupItem>Save time with automated boilerplate code generation</ListGroupItem>
                                <ListGroupItem>Customize your network architecture with flexible organization and channel options</ListGroupItem>
                                <ListGroupItem>Accelerate development with pre-configured API, Explorer, and Caliper setups</ListGroupItem>
                                <ListGroupItem>Scale your network easily by adding organizations and channels as needed</ListGroupItem>
                            </ListGroup>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-5">
                <Col className="text-center text-white">
                    <h2 className="display-4 text-center text-white mb-4">Ready to build your Hyperledger Fabric network?</h2>
                    <Button color="success" size="lg" className="mt-3" >
                        Get Started Now
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}