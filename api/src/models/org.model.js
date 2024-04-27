const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  configuration: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
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
});

const Org = mongoose.model('Org', organizationSchema);

module.exports = Org;
