const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ErrorFormDataSchema = new Schema({
  email: String,
  OrganizationName: String,
  people: {
    standard: [Number],
    professional: [Number],
    enterprise: [Number]
  },
  process: {
    standard: [Number],
    professional: [Number],
    enterprise: [Number]
  },
  technology: {
    standard: [Number],
    professional: [Number],
    enterprise: [Number]
  },
  error_message: String,
  
},{
  timestamps: true
});

module.exports = mongoose.model('ErrorFormData', ErrorFormDataSchema);
