const Org = require('../models/org.model');
const Subscription = require('../models/subscription.model');
const Transaction = require('../models/transaction.model');
const { REQUEST_STATUS } = require('../utils/Constants');

const createPayment = async (data) => {
  console.log('--razor pay data----', data);

  try {
    let t = {
      txId: data?.payload?.payment?.entity?.id,
      email: data?.payload?.payment?.entity?.notes?.email,
      name: data?.payload?.payment?.entity?.notes?.name,
      amount: data?.payload?.payment?.entity?.amount,
      currency: data?.payload?.payment?.entity?.currency,
      status: data?.payload?.payment?.entity?.status,
      fee: data?.payload?.payment?.entity?.fee,
      event: data?.event,
    };
    let txData = new Transaction(t);
    console.log('-------------txData--------------', t, txData);

    await txData.save();

    let sub = await Subscription.findOne({ email: t.email }).exec();
    console.log('-----------cp1-----------------', sub);
    if (sub) {
      console.log('-----------cp2 if-----------------');
      let newAmount = sub.amount + t.amount;
      console.log('-----------cp2.1-----------------', newAmount);
      await Subscription.updateOne({ email: t.email }, { $set: { amount: newAmount } });
    } else {
      console.log('-----------cp3 else-----------------');
      let s = {
        email: t.email,
        name: t.name,
        amount: t.amount,
        currency: t.currency,
      };
      if (t.amount >= 1) {
        s.credit = 10;
      } else {
        s.credit = 1;
      }
      console.log('-------------subscription--------------', s);
      let subscription = new Subscription(s);
      await subscription.save();
    }
  } catch (error) {
    console.log('Error occurred---------', error);
  }
};

module.exports = {
  createPayment,
};
