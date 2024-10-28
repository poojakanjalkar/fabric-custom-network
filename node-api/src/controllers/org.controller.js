const OrgService = require('../services/org.service');
const path = require("path");
const fs = require("fs");
const httpStatus = require('http-status');
const { getSuccessResponse, getErrorResponse } = require('../utils/Response');
const { getPagination } = require('../utils/pagination');
const FileService = require('../services/file.service');
const Org = require('../models/org.model');

const getAllOrganizations = async (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  let options = { offset, limit, sort: { createdAt: -1 } };
  const organizations = await OrgService.getAllOrganizations(options);
  // console.log('----docs-----', organizations);
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

const downloadFile = async(req, res) => {
  let { filename, projectId } = req.params;
  const { user } = req.loggerInfo;
  let org = await Org.findById(projectId)
  filename = org._id+'.zip'
  try {
    // Get file path from the service
    const filePath = FileService.getUserFile(user.email, filename);
    console.log("================", user, filename, filePath)


    fs.exists(filePath, (exists) => {
      if (!exists) {
        res
          .status(httpStatus.NOT_FOUND)
          .send(getErrorResponse(httpStatus.NOT_FOUND, "No project found", 'No project found'))
        return;
      }

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Disposition');
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="file.zip"`);

      const readStream = fs.createReadStream(filePath);
      readStream.pipe(res);
    });

  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getAllOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  downloadFile
};
