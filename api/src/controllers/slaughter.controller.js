const SlaughterService = require('../services/slaughter.service');
const httpStatus = require('http-status');
const { getSuccessResponse } = require('../utils/Response');
const { getPagination } = require('../utils/pagination');

const getAll = async (req, res) => {
  const { user } = req.loggerInfo;
  const { page, size } = req.query;
  const filter = {
    orgId: parseInt(user.orgId),
  };
  const { limit, offset } = getPagination(page, size);
  let options = { offset, limit, sort: { createdAt: -1 } };
  console.log('----options---', options);
  const slaughters = await SlaughterService.getAll(options, filter);
  console.log('><><><></></></>', slaughters);
  res.status(httpStatus.OK).send(getSuccessResponse(httpStatus.OK, 'data fetched successfully', slaughters));
};

const getById = async (req, res) => {
  const slaughter = await SlaughterService.getById(req.params.id);
  const { user } = req.loggerInfo;
  if (slaughter) {
    res.status(httpStatus.OK).send(getSuccessResponse(httpStatus.OK, 'data  fetched successfully', slaughter));
  } else {
    res.status(httpStatus.OK).send(getSuccessResponse(httpStatus.OK, 'data not found'));
  }
};

const create = async (req, res) => {
  const { user } = req.loggerInfo;
  const newSlaughter = await SlaughterService.create(req.body, user);
  res.status(httpStatus.OK).send(getSuccessResponse(httpStatus.OK, 'data created successfully', newSlaughter));
};

module.exports = {
  getAll,
  getById,
  create,
};
