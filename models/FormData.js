// models/FormData.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FormDataSchema = new Schema({
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
  }
});

module.exports = mongoose.model('FormData', FormDataSchema);
