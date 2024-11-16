const httpStatus = require('http-status');
const Subscription = require('../models/subscription.model');
const catchAsync = require('../utils/catchAsync');
const { getSuccessResponse, getErrorResponse } = require('../utils/Response');
const ConfigurationData = require('../models/configurationData');
const logger = require('../logger')(module);

const validateSubscription = catchAsync(async (req, res, next) => {
  let { email } = req.loggerInfo.user;
  console.log('*********', email);
  logger.info({method:'', message:'Validating subscription', data: req.loggerInfo})
  let subscription = await Subscription.findOne({ email: email }).exec();

  let config = await ConfigurationData.findOne({id: 'CONFIGURATION'})
  let data = JSON.parse(config?.data)
  console.log("-----------------", typeof config?.data, config?.data)
  if(data){
    // let data = JSON.parse(config?.data)
    if(!data.isEnabled){
      console.log("-------config?.data-------------", data.isEnabled)
      return next()
    }else{
      console.log("-------config?.data-------------", data.isEnabled)
    }
  }

  if (!subscription || subscription?.credit <= 0) {
    // return res.status(403).json({ error: 'Insufficient balance' });
    return res
      .status(httpStatus.OK)

      .send(getSuccessResponse(httpStatus.OK, 'Insufficient balance, please buy credit on profile page', 'INSUFFICIENT BALANCE'));
  } else {
    return next();
  }
});

module.exports = {
  validateSubscription,
};
