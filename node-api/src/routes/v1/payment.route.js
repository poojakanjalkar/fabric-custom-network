const { payment, createOrder } = require("../../controllers/payment.controller");
const { auth, adminAuth } = require('../../middlewares/auth');
const express = require('express');
const router = express.Router();

router.post('/webhook', payment);
router.post('/order-id', auth , createOrder);


module.exports = router;
