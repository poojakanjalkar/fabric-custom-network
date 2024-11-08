const { model, Schema } = require('mongoose');

const configurationSchema = new Schema(
  {

    id:{type: String, required: true},
    data: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

const ConfigurationData = model('configurationData', configurationSchema);

module.exports = ConfigurationData;
