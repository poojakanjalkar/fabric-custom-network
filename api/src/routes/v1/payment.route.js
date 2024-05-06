const { payment } = require("../../controllers/payment.controller");

const express = require('express');
const router = express.Router();

router.post('/webhook', payment);

module.exports = router;
