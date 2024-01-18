const mongoose = require("mongoose");
const Schema = mongoose.Schema;
/*const clientModel = require("../client/clientModel");*/

const PsychologistSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  surName: {
    type: String,
    required: true,
  },
  pass: {
    type: String,
    required: true,
  },
  eMail: {
    type: String,
    maxLength: 100,
    minLength: 5,
    required: true,
    unique: true,
  },
  tag: [],
  image: {
    type: String,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
  unvan: {
    type: String,
    require: true,
  },
  star: [{ type: Number, min: 1, max: 5 }],
  starAvg: [{ type: Number }],
  active: {
    type: Boolean,
    default: false,
  },
  accActive: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("psychologist", PsychologistSchema);
