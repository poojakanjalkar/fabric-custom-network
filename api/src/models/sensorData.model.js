const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { toJSON, paginate } = require('./plugins');

const sensorReadingSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
  },
  temperature: {
    type: String,
  },
  location: {
    type: Object,
  },
  cattleId: {
    type: String,
    required: true,
  },
  deviceId: {
    type: String,
    required: true,
    trim: true,
  },
  batteryLevel: {
    type: Number,
    required: true,
    trim: true,
  },
  captureDate: {
    type: Date,
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
},{timestamp: true});

sensorReadingSchema.plugin(toJSON);
sensorReadingSchema.plugin(paginate);

sensorReadingSchema.plugin(mongoosePaginate);

const cattleModel = mongoose.model('SensorReading', sensorReadingSchema);
module.exports = cattleModel;
