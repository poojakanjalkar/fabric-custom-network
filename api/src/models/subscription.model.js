const mongoose = require('mongoose');

const SubscriptionSchema = mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  currency: { type: String, required: true },
  amount: { type: Number, required: true },
  credit: { type: Number, required: true },
});

const Subscription = mongoose.model('Subscription', SubscriptionSchema);
module.exports = Subscription;
