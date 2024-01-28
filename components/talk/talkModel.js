const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reservationModule = require("../reservation/reservationModule");

const talkSchema = new Schema({
  reservation_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: reservationModule,
    require: true,
    unique: true,
  },
  disorder_rate: {
    type: String,
    require: true,
  },
  head_move: {
    type: String,
    require: true,
  },
  emotion: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("talk", talkSchema);
