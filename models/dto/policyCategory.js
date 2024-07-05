const mongoose = require('mongoose');

const policyCategorySchema = new mongoose.Schema({
    categoryName: String,
});

module.exports = mongoose.model('policyCategory', policyCategorySchema);