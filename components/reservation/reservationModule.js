const mongoose = require("mongoose");
const psycModel = require("../psychologist/psychologistModel");
const clientModel = require("../client/clientModel");
const Schema = mongoose.Schema;
const ReservationSchema = new Schema({
  day: {
    type: Date,
    required: true,
    get: function (value) {
      return value.toISOString().slice(0, 10);
    },
  },
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
  time: {
    type: String,
    required: true,
    trim: true,
    match: /^([0-1]?[0-9]|2[0-3])\.[0-5][0-9]$/,
  },
  payCheck: {
    type: Boolean,
    default: true,
  },
});
module.exports = mongoose.model("reservation", ReservationSchema);
