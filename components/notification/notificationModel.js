const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const psycModel = require("../psychologist/psychologistModel");
const clientModel = require("../client/clientModel");
const reservationModel = require("../reservation/reservationModule");
const testModel = require("../test/testModel");

const notificationSchema = new Schema({
  psyc_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: psycModel,
  },
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: clientModel,
  },
  reservation_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: reservationModel,
  },
  test_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: testModel,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  validDate: {
    type: Date,
    require: true,
  },
  type: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("notification", notificationSchema);
