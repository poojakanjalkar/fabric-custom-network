const PaymentService = require('../services/payment.service');
const Razorpay = require("razorpay");
const httpStatus = require('http-status');
const { getSuccessResponse } = require('../utils/Response');
const logger = require('../logger')(module)

const crypto = require('crypto');
const config = require('../config/config');
const ConfigurationData = require('../models/configurationData');

function verifyWebhookSignature(secret, body, signature) {
  const expectedSignature = crypto.createHmac('sha256', secret).update(body, 'utf8').digest('hex');

  return expectedSignature === signature;
}

const payment = async (req, res) => {
  console.log('-----------------received data from razorpay-------------------', req.body);
  logger.info({method:'payment', message: "Webhook triggered", data: req.body})
  const secret =  config.razorPayWebhookSecret //'8WrI4Kbxg9zGHl7vyRzUEkvl'; // Replace with your actual webhook secret
  const body = JSON.stringify(req.body);
  console.log('----------data------', JSON.stringify(body));
  const signature = req.get('X-Razorpay-Signature');

  if (!verifyWebhookSignature(secret, body, signature)) {
    console.error('Webhook signature verification failed');
    return res.status(403).send('Invalid webhook signature');
  }
  console.log('Webhook signature verified successfully');
  await PaymentService.createPayment(req.body);
  res.json({ status: 'ok' });
};

// Initialize Razorpay instance with your key and secret
const razorpay = new Razorpay({
  key_id: config.razorPayKey,
  key_secret: config.razorPaySecret,
});

const  {getUUID} = require('../utils/uuid')

const createOrder =  async (req, res)=> {
  // const { amount, currency, receipt } = req.body;
  let receiptId = getUUID()

  let existingData = await ConfigurationData.findOne({id:'CONFIGURATION'})
  console.log("------existingData-------",existingData)
  let pricingInfo = JSON.parse(existingData?.data)
  const options = {
    amount: (pricingInfo.price || 30) * 100, // amount in smallest currency unit (e.g., 100 rupees = 10000 paise)
    currency: pricingInfo.currency || 'USD',
    receipt:receiptId,
  };


  try {
    const order = await razorpay.orders.create(options);
    console.log("------ordery-------",order)
    logger.info({method: '', message: `order created ${order?.id}`, orderdata: order})
    res.json(getSuccessResponse(httpStatus.OK, 'Order Id fetched successfully', 
      { orderId: order.id, amount: order.amount, currency: order.currency, key : config.razorPayKey }))
  } catch (error) {
    logger.error({method:'createOrder', message:error, error: error.message, stack:error.stack})
    res.status(500).send("Error creating order");
  }


}

module.exports = {
  payment,
  createOrder
};
