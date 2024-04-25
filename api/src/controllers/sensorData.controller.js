const httpStatus = require('http-status');
const SensorDataService = require('../services/sensorData.service');
const { getSuccessResponse } = require('../utils/Response');
const { getPagination } = require('../utils/pagination');

// const getAllDevices = async (req, res) => {
//   console.log(req.query);
//   const {user} = req.loggerInfo
//   const { page, size } = req.query;
//   const filter = {
//     orgId: user.orgId
//   }
//   const { limit, offset } = getPagination(page, size);
//   let options = { offset, limit, sort: { createdAt: -1 } };
//   console.log('----options---', options);
//   const result = await DeviceService.getAllDevices(options, filter);
//   console.log('result------', result);
//   res.status(httpStatus.OK).send(getSuccessResponse(httpStatus.OK, 'Device fetched successfully', result));
// };

const addSensorReading = async (req, res) => {
  const {user} = req.loggerInfo
  const newDevice = await SensorDataService.addSensorData(req.body, user);
  res.status(httpStatus.OK).send(getSuccessResponse(httpStatus.OK, 'Sensor Data Added successfully', newDevice));
};



module.exports = {
  addSensorReading
};
