const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const psycModel = require("../psychologist/psychologistModel");

const ClientSchema = new Schema({
  name: {
    type: String,
    maxLength: 60,
    minLength: 2,
    required: true,
  },
  surName: {
    type: String,
    maxLength: 60,
    minLength: 2,
    required: true,
  },
  pass: {
    type: String,
    maxLength: 60,
    minLength: 5,
    required: true,
  },
  eMail: {
    type: String,
    maxLength: 100,
    minLength: 5,
    required: true,
    unique: true,
  },
  dateOfBirth: {
    type: Date,
    require: true,
    default: Date.now,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
  },
  sex: {
    type: String,
    require: true,
  },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: psycModel }],
  number: {
    type: Number,
    require: true,
  },
});

module.exports = mongoose.model("client", ClientSchema);
