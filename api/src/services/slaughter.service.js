const Slaughter = require('../models/slaughter.model');

const getAll = async (options, filter) => {
  console.log('+++++++', options, filter);
  return Slaughter.paginate(filter, options);
};

const getById = async (id) => {
  return Slaughter.findById(id);
};

const create = async (data, user) => {
  const piecesList = [];
  if (data.numberOfPieceCount) {
    let piece;
    for (let i = 1; i <= data.numberOfPieceCount; i++) {
      piece = {
        pieceId: `${data.cattleId}-${i}`,
      };
      piecesList.push(piece);
    }
  }
  const slaughter = new Slaughter(data);
  slaughter.orgId = parseInt(user.orgId);
  slaughter.createdBy = user.email;
  slaughter.updatedBy = user.email;
  slaughter.createdAt = new Date();
  slaughter.updatedAt = new Date();
  slaughter.pieces = piecesList;
  return slaughter.save();
};

module.exports = {
  getAll,
  getById,
  create,
};
