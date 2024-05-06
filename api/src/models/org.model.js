const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { toJSON, paginate } = require('./plugins');

const organizationSchema = new mongoose.Schema(
  {
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
  },
  { timestamp: true }
);

organizationSchema.plugin(toJSON);
organizationSchema.plugin(paginate);

organizationSchema.plugin(mongoosePaginate);

const Org = mongoose.model('Org', organizationSchema);

module.exports = Org;
