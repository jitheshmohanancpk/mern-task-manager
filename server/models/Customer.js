const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  company: { type: String },
  status: { type: String, default: 'Active' } // Active, Inactive, Lead
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);