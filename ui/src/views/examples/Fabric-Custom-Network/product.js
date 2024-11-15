import React, { useEffect , useState} from 'react';
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
    ListGroupItem,
    Input,
    Form,
    FormGroup,
    Label
} from 'reactstrap';

// import {
//     Container, Row, Col, Card, CardBody, CardTitle, Form, FormGroup, Label, Input, Button, FormText,
// } from 'reactstrap';

export default function Component() {

    const EXCHANGE_RATES = {
        USD: 1,
        EUR: 0.92,
        GBP: 0.79,
        JPY: 151.41,
        AUD: 1.53,
        CAD: 1.35,
        CHF: 0.90,
        CNY: 7.23,
        INR: 83.12,
      };
      

    const startPayment = async (name, email, amount,currency) => {
        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );

        if (!res) {
            alert("You are offline... Failed to load Razorpay SDK");
            return;
        }

        const options = {
            key: "rzp_live_vQB9BF739hlsCx",
            // currency: 'INR',
            currency,
            // currency: "USD",
            // amount: 1999 * 100,
            amount: amount*100,
            name: "Morya Innovation",
            description: "Thanks for purchasing",
            customer: {
                name: name,
                email: email,
            },
            handler: async function (response) {
            },
            notes: {
                name:name,
                email:email,
            },
            prefill: {
                name: "Morya Innovation",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [price, setPrice] = useState(30);
    const basePrice = 99;
  
    useEffect(() => {
      fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
          if (EXCHANGE_RATES[data.currency]) {
            setSelectedCurrency(data.currency);
          }
        })
        .catch(() => {
          console.log('Failed to detect location, using default USD');
        });
    }, []);
  
    useEffect(() => {
      const newPrice = basePrice * EXCHANGE_RATES[selectedCurrency];
      setPrice(Number(newPrice.toFixed(2)));
    }, [selectedCurrency]);
  
    const handleCurrencyChange = (e) => {
      setSelectedCurrency(e.target.value);
    };
  
    const formatPrice = (price) => {
      return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price);
    };
  
    const getCurrencySymbol = (currency) => {
      const symbols = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        JPY: '¥',
        AUD: 'A$',
        CAD: 'C$',
        CHF: 'CHF',
        CNY: '¥',
        INR: '₹',
      };
      return symbols[currency] || currency;
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const form = e.target;
      const name = form.elements.name.value;
      const email = form.elements.email.value;
      console.log('Starting payment for:', { name, email, amount: price, currency: selectedCurrency });

      startPayment(name, email, price,selectedCurrency )
      // Implement your payment logic here
    };

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
            <Card className="py-3 px-3">
                        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%', backgroundColor: '#000' }}>
                          <iframe
                            src="https://www.youtube.com/embed/4tXGpabPRsE"
                            title="YouTube video player"
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </Card>
            <Row className="mb-5">
                <Col md={10}>
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
                {/* <Col md={4}>
                    <Card className="bg-white">
                        <CardBody className="text-center">


                            <Row className="mb-4 align-items-center">
                                <Col>
                                    <CardTitle tag="h2" className="text-center font-weight-bold">Premium Plan</CardTitle>
                                </Col>
                                <Col className="text-end">
                                    <div className="d-flex align-items-center">
                                        <span role="img" aria-label="globe" className="me-2">🌐</span>
                                        <Input
                                            type="select"
                                            value={selectedCurrency}
                                            onChange={handleCurrencyChange}
                                            className="form-control-sm"
                                        >
                                            {Object.keys(EXCHANGE_RATES).map((currency) => (
                                                <option key={currency} value={currency}>
                                                    {currency}
                                                </option>
                                            ))}
                                        </Input>
                                    </div>
                                </Col>
                            </Row>

                            <div className="text-center my-4">
                                <h1 className="display-4 font-weight-bold">
                                    {getCurrencySymbol(selectedCurrency)}{formatPrice(price)}
                                </h1>
                            </div>
                            <p className="text-center text-muted">One-time purchase</p>

                            <Form onSubmit={handleSubmit} className="mt-4">
                                <FormGroup>
                                    <Label for="name" className="sr-only">Name</Label>
                                    <Input
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="Your Name"
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="email" className="sr-only">Email</Label>
                                    <Input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </FormGroup>
                                <Button
                                    color="primary"
                                    type="submit"
                                    className="w-100"
                                >
                                    Buy Now
                                </Button>
                            </Form>

                            <div className="mt-4 text-center text-muted small">
                                <p>Price shown in {selectedCurrency}</p>
                            </div>

                        </CardBody>
                    </Card>
                </Col> */}
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

            <Row className="mt-4">
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