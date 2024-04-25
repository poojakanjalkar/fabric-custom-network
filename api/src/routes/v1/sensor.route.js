const express = require('express');
const { auth } = require('../../middlewares/auth');
const { addSensorReading } = require('../../controllers/sensorData.controller');
const router = express.Router();

router.post('/', auth, addSensorReading);
module.exports = router;
