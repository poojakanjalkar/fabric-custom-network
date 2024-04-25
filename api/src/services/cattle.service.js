const cattleModel = require('../models/cattle.model');
const { NETWORK_ARTIFACTS_DEFAULT } = require('../utils/Constants');
const { getContractObject } = require('../utils/blockchainUtils');
const utf8Decoder = new TextDecoder();

const getAllCattle = async (options, filter) => {
  return cattleModel.paginate(filter, options);
};

const createCattle = async (body, user) => {
  let data = {
    cattleId: body.id,
    id:body.id,
    breed: body.breed,
    dateOfBirth: body.dateOfBirth,
    baseLocation: body.baseLocation,
    deviceId: body.deviceId,
    ownerId: body.ownerId,
    ownerName: body.ownerName,
    ownerSurname: body.ownerSurname,
    orgId: parseInt(user.orgId),
    createdBy: user.email,
    updatedBy: user.email,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const newCattle = new cattleModel(data);
  await newCattle.save();

  data.docType='Cattle'

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
    await contract.submitTransaction('CreateAsset', JSON.stringify(data));
    if (gateway) {
      gateway.close();
    }
    if (client) {
      client.close();
    }
  } catch (error) {
    console.log("------------------", error)
  }
  


  return newCattle;
};

const getCattleById = async (id) => {
  return cattleModel.findById(id);
};

const updateCattle = async (id, body, user) => {
  const cattle = await cattleModel.findById(id);
  cattle.ownerId = body.ownerId;
  cattle.ownerName = body.ownerName;
  const blockchainCattleId = cattle.cattleId
  cattle.ownerSurname = body.ownerSurname;
  await cattle.save();

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
  let result = await  contract.submitTransaction('getAssetByID', blockchainCattleId);
  result =  JSON.parse(utf8Decoder.decode(result));
  console.log("---update Result ----", result)
  result.ownerId = body.ownerId
  result.ownerName = body.ownerName
  result.ownerSurname = body.ownerSurname
  await  contract.submitTransaction('CreateAsset', JSON.stringify(result));
  console.log("---device data updated on blockchain")
  if (gateway) {
    gateway.close();
  }
  if(client){
    client.close()
  }

return cattle


};

module.exports = {
  getAllCattle,
  createCattle,
  getCattleById,
  updateCattle,
};
