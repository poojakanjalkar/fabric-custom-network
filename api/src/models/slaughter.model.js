const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { toJSON, paginate } = require('./plugins');
const slaughterSchema = mongoose.Schema(
  {
    cattleId: {
      type: String,
      required: true,
    },
    slaughterHouseName: {
      type: String,
      required: true,
    },
    slaughtererName: {
      type: String,
      required: true,
    },
    slaughtererSurname: {
      type: String,
      required: true,
    },
    slaughterDate: {
      type: Date,
      required: true,
    },

    coldRoomId: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    numberOfPieceCount: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
      trim: true,
    },
    updatedBy: {
      type: String,
      required: true,
      trim: true,
    },
    orgId: {
      type: Number,
      required: true,
    },
    pieces: {
      type: [Object],
      required: true,
    },
  },
  { timestamp: true }
);
slaughterSchema.plugin(toJSON);
slaughterSchema.plugin(paginate);

slaughterSchema.plugin(mongoosePaginate);
const slaughterModel = mongoose.model('Slaughter', slaughterSchema);
module.exports = slaughterModel;
