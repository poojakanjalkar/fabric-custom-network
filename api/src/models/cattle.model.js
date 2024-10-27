const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { toJSON, paginate } = require('./plugins');

const cattleSchema = mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      trim: true,
    },
    cattleId: {
      type: String,
      required: true,
      trim: true,
    },
    breed: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
      trim: true,
    },
    baseLocation: {
      type: String,
      required: true,
      trim: true,
    },
    orgId: {
      type: Number,
      required: true,
    },
    deviceId: {
      type: String,
      required: true,
      trim: true,
    },
    ownerId: {
      type: String,
      required: true,
      trim: true,
    },
    ownerName: {
      type: String,
      required: true,
      trim: true,
    },
    ownerSurname: {
      type: String,
      required: true,
      trim: true,
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
  },
  { timestamp: true }
);

cattleSchema.plugin(toJSON);
cattleSchema.plugin(paginate);

cattleSchema.plugin(mongoosePaginate);

const cattleModel = mongoose.model('cattle', cattleSchema);
module.exports = cattleModel;
