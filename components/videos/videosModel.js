const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reservationModel = require("../reservation/reservationModule");

const videosSchema = new Schema({
  reservation_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: reservationModel,
    require: true,
  },
  fileName: {
    type: String,
    require: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("videos", videosSchema);
