const PaymentService = require('../services/payment.service');
const httpStatus = require('http-status');
const { getSuccessResponse } = require('../utils/Response');
const logger = require('../logger')(module)

const crypto = require('crypto');
const config = require('../config/config');

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

module.exports = {
  payment,
};
