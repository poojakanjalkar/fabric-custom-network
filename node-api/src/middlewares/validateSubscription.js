const httpStatus = require('http-status');
const Subscription = require('../models/subscription.model');
const catchAsync = require('../utils/catchAsync');
const { getSuccessResponse, getErrorResponse } = require('../utils/Response');

const validateSubscription = catchAsync(async (req, res, next) => {
  let { email } = req.loggerInfo.user;
  console.log('*********', email);
  let subscription = await Subscription.findOne({ email: email }).exec();

  if (!subscription || subscription?.credit <= 5) {
    // return res.status(403).json({ error: 'Insufficient balance' });
    return res
      .status(httpStatus.OK)

      .send(getSuccessResponse(httpStatus.OK, 'Insufficient balance, please buy credit', 'INSUFFICIENT BALANCE'));
  } else {
    return next();
  }

  console.log('---------subscribed user-----', subscription);

  // next();
});

module.exports = {
  validateSubscription,
};
