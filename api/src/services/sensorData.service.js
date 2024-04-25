const Device = require('../models/device.model');
const SensorData = require('../models/sensorData.model');
const { NETWORK_ARTIFACTS_DEFAULT } = require('../utils/Constants');
const { getContractObject } = require('../utils/blockchainUtils');
const { getUUID } = require('../utils/uuid');

let devices = [];

const getAllDevices = async (options, filter) => {
  console.log(options);
  return Device.paginate(filter, options);
};

const addSensorData = async (body, user) => {
  let data = {
    type: body.type,
    id: getUUID(),
    deviceId: body.deviceId,
    cattleId: body.cattleId,
    temperature: body.temperature,
    tempUnit: body.tempUnit,
    location: body.location,
    batteryLevel: body.batteryLevel,
    captureDate: new Date(),
    orgId: parseInt(user.orgId),
    createdBy: user.email,
    updatedBy: user.email,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const lastRecord = await SensorData.findOne({ deviceId: data.deviceId, cattleId: data.cattleId }, { sort: { timestamp: -1 } });

  // console.log('--------data9999999999999999--------',  data);
  console.log('--------lastRecord--------',  lastRecord);
  const newSensorData = SensorData(data);
  let response = await newSensorData.save();
  data.docType = 'SensorData';
  console.log('----data------', data);

  try {
    let gateway;
    let client;
    let orgName = `org${user.orgId}`;
    const contract = await getContractObject(
      orgName,
      user.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
      gateway,
      client
    );
    await contract.submitTransaction('AddSensorReading', JSON.stringify(data), lastRecord?.id || '');
    if (gateway) {
      gateway.close();
    }
    if (client) {
      client.close();
    }
  } catch (error) {
    console.log("------------------", error)
  }

  // return agreementData.data;

  return newSensorData;
};

module.exports = {
  addSensorData,
};
