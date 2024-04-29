const OrgService = require('../services/org.service');
const httpStatus = require('http-status');
const { getSuccessResponse } = require('../utils/Response');
const { getPagination } = require('../utils/pagination');

const getAllOrganizations = async (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  let options = { offset, limit, sort: { createdAt: -1 } };
  const organizations = await OrgService.getAllOrganizations(options);
  console.log('----docs-----', organizations);
  res.status(httpStatus.OK).send(getSuccessResponse(httpStatus.OK, 'organization fetched successfully', organizations));
};

const getOrganizationById = async (req, res) => {
  const organization = await OrgService.getOrganizationById(req.params.id);
  if (organization) {
    res.status(httpStatus.OK).send(getSuccessResponse(httpStatus.OK, 'organization fetched successfully', organization));
  } else {
    res.status(404).json({ message: 'Organization not found' });
  }
};

const createOrganization = async (req, res) => {
  console.log('controller body---', req.body);
  const { user } = req.loggerInfo;
  console.log('----user----', req.loggerInfo);
  const newOrganization = await OrgService.createOrganization(req.body, user);

  res.status(httpStatus.OK).send(getSuccessResponse(httpStatus.OK, 'organization created successfully', newOrganization));
};

const updateOrganization = async (req, res) => {
  const updatedOrganization = await OrgService.updateOrganization(req.params.id, req.body, { new: true });
  res
    .status(httpStatus.OK)
    .send(getSuccessResponse(httpStatus.OK, 'organization updated successfully', updatedOrganization));
};

const deleteOrganization = async (req, res) => {
  await OrgService.deleteOrganization(req.params.id);
  res.status(httpStatus.OK).send(getSuccessResponse(httpStatus.OK, 'organization deleted successfully', organization));
};

module.exports = {
  getAllOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
};
