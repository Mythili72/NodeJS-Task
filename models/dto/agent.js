const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
    agentName: String,
});
module.exports = mongoose.model('agent', agentSchema);