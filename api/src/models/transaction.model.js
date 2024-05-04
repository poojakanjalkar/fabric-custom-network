const mongoose = require('mongoose');

const TxSchema = mongoose.Schema({
  txId: { type: String, required: true },
  event: { type: String, require: false },
  email: { type: String, required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, required: true },
  fee: { type: Number, required: true },
  event: { type: String, required: true },
});

const Transaction = mongoose.model('Transaction', TxSchema);
module.exports = Transaction;
