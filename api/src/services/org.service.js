const Org = require('../models/org.model');
const Subscription = require('../models/subscription.model');
const { REQUEST_STATUS } = require('../utils/Constants');

const getAllOrganizations = async (options, filter) => {
  console.log('++++++options+++++', options);
  const result = await Org.find({});
  console.log('________', result);
  return Org.paginate(filter, options);
};

const getOrganizationById = async (id) => {
  return Org.findById(id);
};

const createOrganization = async (data, user) => {
  console.log('--service data----', data);
  let requestModel = {
    configuration: data,
    createdBy: user.email,
    updatedBy: user.email,
    userId: user.email,
    status: REQUEST_STATUS.SUBMIT,
  };
  const res = await Subscription.updateOne(
    { email: user.email, credit: { $gt: 0 } }, // Ensure there are enough credits
    { $inc: { credit: -1 } }
  ).exec();

  console.log('+++++++geting subscription res---', res);
  const organization = new Org(requestModel);
  return organization.save();
};

const updateOrganization = async (id, newData) => {
  return Org.findByIdAndUpdate(id, newData, { new: true });
};

const deleteOrganization = async (id) => {
  return Org.findByIdAndDelete(id);
};

module.exports = {
  getAllOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
};
