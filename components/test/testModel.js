const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const psycModel = require("../psychologist/psychologistModel");
const clientModel = require("../client/clientModel");

const testSchema = new Schema({
  psyc_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: psycModel,
    require: true,
  },
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: clientModel,
    require: true,
  },
  testName: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    require: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
  },
  response: {
    type: String,
  },
});

module.exports = mongoose.model("test", testSchema);
