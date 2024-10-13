const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { toJSON, paginate } = require('./plugins');

const deviceSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  deviceId: {
    type: String,
    required: true,
  },
  orgId: {
    type: Number,
    required: true,
  },
  calibrationDate: {
    type: Date,
    required: true,
  },
  calibrationExpiryDate: {
    type: Date,
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
},{timestamp: true});

deviceSchema.plugin(toJSON);
deviceSchema.plugin(paginate);

deviceSchema.plugin(mongoosePaginate);
const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
