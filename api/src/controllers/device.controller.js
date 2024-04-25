const httpStatus = require('http-status');
const DeviceService = require('../services/device.service');
const { getSuccessResponse } = require('../utils/Response');
const { getPagination } = require('../utils/pagination');

const getAllDevices = async (req, res) => {
  console.log(req.query);
  const {user} = req.loggerInfo
  const { page, size } = req.query;
  const filter = {
    orgId: user.orgId
  }
  const { limit, offset } = getPagination(page, size);
  let options = { offset, limit, sort: { createdAt: -1 } };
  console.log('----options---', options);
  const result = await DeviceService.getAllDevices(options, filter);
  console.log('result------', result);
  res.status(httpStatus.OK).send(getSuccessResponse(httpStatus.OK, 'Device fetched successfully', result));
};

const createDevice = async (req, res) => {
  const {user} = req.loggerInfo
  const newDevice = await DeviceService.createDevice(req.body, user);
  res.status(201).json(newDevice);
};

const getDeviceById = async (req, res) => {
  const { id } = req.params;
  const result = await DeviceService.getDeviceById(id);
  res.status();
  res.status(httpStatus.OK).send(getSuccessResponse(httpStatus.CREATED, 'device fetched successfully', result));
};

const updateCalibrationDate = async (req, res) => {
  const {user} = req.loggerInfo
  const result = await DeviceService.updateCalibrationDate(
    req.params.id,
    req.body.calibrationDate,
    req.body.calibrationExpiryDate,
    user
  );
  res.status();
  res.status(httpStatus.OK).send(getSuccessResponse(httpStatus.CREATED, 'device updated successfully', result));
};

module.exports = {
  getAllDevices,
  createDevice,
  getDeviceById,
  updateCalibrationDate,
};
