const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
    policyNumber: String,
    policyStartDate: Date,
    policyEndDate: Date,
    policyCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'policyCategory' },
    policyCarrier: { type: mongoose.Schema.Types.ObjectId, ref: 'policyCarrier' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
});

module.exports = mongoose.model('policyInfo', policySchema);