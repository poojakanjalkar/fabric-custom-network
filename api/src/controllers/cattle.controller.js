const httpStatus = require('http-status');
const cattleService = require('../services/cattle.service');
const { getSuccessResponse } = require('../utils/Response');
const { getPagination } = require('../utils/pagination');

const getAllCattle = async (req, res) => {
  const { user } = req.loggerInfo;
  const { page, size } = req.query;
  const filter = {
    orgId: user.orgId,
  };
  const { limit, offset } = getPagination(page, size);
  let options = { offset, limit, sort: { createdAt: -1 } };
  console.log('----options---', options);
  const allCattle = await cattleService.getAllCattle(options, filter);
  res.status(httpStatus.OK).send(getSuccessResponse(httpStatus.OK, 'cattle fetched successfully', allCattle));
};

const createCattle = async (req, res) => {
  const { user } = req.loggerInfo;
  const newCattle = await cattleService.createCattle(req.body, user);
  res.status();
  res.status(httpStatus.OK).send(getSuccessResponse(httpStatus.CREATED, 'cattle created successfully', newCattle));
};

const getCattleById = async (req, res) => {
  const { id } = req.params;
  const { user } = req.loggerInfo;
  const result = await cattleService.getCattleById(id);
  res.status();
  res.status(httpStatus.OK).send(getSuccessResponse(httpStatus.CREATED, 'cattle fetched successfully', result));
};

const updateCattle = async (req, res) => {
  const { user } = req.loggerInfo;
  console.log('=========', req.params.id, req.body);
  const result = await cattleService.updateCattle(req.params.id, req.body, user);
  res.status();
  res.status(httpStatus.OK).send(getSuccessResponse(httpStatus.CREATED, 'cattle updated successfully', result));
};

module.exports = {
  getAllCattle,
  createCattle,
  getCattleById,
  updateCattle,
};
