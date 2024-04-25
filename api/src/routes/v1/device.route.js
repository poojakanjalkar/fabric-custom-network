const express = require('express');
const { getAllDevices, createDevice, getDeviceById, updateCalibrationDate } = require('../../controllers/device.controller');
const { auth } = require('../../middlewares/auth');
const router = express.Router();

router.get('/', auth, getAllDevices);
router.post('/', auth, createDevice);
router.get('/:id', auth, getDeviceById);
router.put('/:id', auth, updateCalibrationDate);
module.exports = router;
