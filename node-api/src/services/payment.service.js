const logger = require('../logger')(module)
const Subscription = require('../models/subscription.model');
const Transaction = require('../models/transaction.model');

const createPayment = async (data) => {
  console.log('--razor pay data----', data);
  logger.info({method:'createPayment', message: "Webhook triggered", data})

  if(data.event !== 'payment.authorized'){
    return
  }

  try {
    let t = {
      txId: data?.payload?.payment?.entity?.id,
      email: data?.payload?.payment?.entity?.notes?.email,
      name: data?.payload?.payment?.entity?.notes?.name,
      amount: data?.payload?.payment?.entity?.amount,
      currency: data?.payload?.payment?.entity?.currency,
      status: data?.payload?.payment?.entity?.status,
      fee: data?.payload?.payment?.entity?.fee || 0,
      event: data?.event,
    };
    let txData = new Transaction(t);

    await txData.save();
    logger.info({method:'createPayment', message: "Transaction created", data: t})

    let sub = await Subscription.findOne({ email: t.email }).exec();
    if (sub) {
      let newAmount = sub.amount + t.amount;
      await Subscription.updateOne({ email: t.email }, { $set: { amount: newAmount, credit: sub.credit + 2 } });
    } else {
      let s = {
        email: t.email,
        name: t.name,
        amount: t.amount,
        currency: t.currency,
      };
        s.credit = 2;
      let subscription = new Subscription(s);
      await subscription.save();
    }
    logger.info({method:'createPayment', message: "Subscription created-updated", data: s})
  } catch (error) {
    console.log('Error occurred---------', error);
    logger.error({method:'createPayment', message: "error occureed", error: error?.message, stack: error?.stack})
  }
};

module.exports = {
  createPayment,
};
