const Device = require('../models/device.model');
const { NETWORK_ARTIFACTS_DEFAULT } = require('../utils/Constants');
const { getContractObject } = require('../utils/blockchainUtils');
const utf8Decoder = new TextDecoder();

let devices = [];

const getAllDevices = async (options, filter) => {
  console.log(options);
  return Device.paginate(filter, options);
};

const createDevice = async (body,user) => {
  let data = {
    name: body.name,
    deviceId: body.deviceId,
    id: body.deviceId,
    calibrationDate: body.calibrationDate,
    calibrationExpiryDate: body.calibrationExpiryDate,
    orgId: parseInt(user.orgId),
    createdBy: user.email,
    updatedBy: user.email,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  console.log("--------data9999999999999999--------", data)
  const newDevice = new Device(data);
  let response = await newDevice.save();
  console.log("-----mongo newDevice------", newDevice)
  data.docType='Device'

  try {
    let gateway;
  let client
  let orgName = `org${user.orgId}`;
  const contract = await getContractObject(
    orgName,
    user.email,
    NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
    NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
    gateway,
    client
  );
  await  contract.submitTransaction('CreateAsset', JSON.stringify(data));
  if (gateway) {
    gateway.close();
  }
  if(client){
    client.close()
  }
  } catch (error) {
    
  }
  
  // return agreementData.data;

  return newDevice;
};

const getDeviceById = async (id) => {
  return Device.findById(id);
};

const updateCalibrationDate = async (deviceId, calibrationDate, calibrationExpiryDate, user) => {
  const device = await Device.findById(deviceId);
  device.calibrationDate = calibrationDate;
  device.calibrationExpiryDate = calibrationExpiryDate;
  const blockchainDeviceId= device.deviceId
  await  device.save();

  let gateway;
  let client
  let orgName = `org${user.orgId}`;
  const contract = await getContractObject(
    orgName,
    user.email,
    NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
    NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
    gateway,
    client
  );
  let result = await  contract.submitTransaction('getAssetByID', blockchainDeviceId);
  result =  JSON.parse(utf8Decoder.decode(result));
  console.log("---update Result ----", result)
  result.calibrationDate = calibrationDate
  result.calibrationExpiryDate = calibrationExpiryDate
  await  contract.submitTransaction('CreateAsset', JSON.stringify(result));
  console.log("---device data updated on blockchain")
  if (gateway) {
    gateway.close();
  }
  if(client){
    client.close()
  }

};

module.exports = {
  getAllDevices,
  createDevice,
  getDeviceById,
  updateCalibrationDate,
};
