const user = require('./user');
const agent = require('./agent');
const account = require('./account');
const policyCarrier = require('./policyCarrier');
const policyCategory = require('./policyCategory');
const policyInfo = require('./policyInfo');

const message = require('./message')

module.exports = {
    user,
    agent,
    account,
    policyCarrier,
    policyCategory,
    policyInfo,
    message
}