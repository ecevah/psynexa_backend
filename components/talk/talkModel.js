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
  depresyon: {
    type: Number,
    require: true,
  },
  bipolar: {
    type: Number,
    require: true,
  },
  borderline: {
    type: Number,
    require: true,
  },
  agorafobi: {
    type: Number,
    require: true,
  },
  parkinson: {
    type: Number,
    require: true,
  },
  sosyalfobi: {
    type: Number,
    require: true,
  },
  debh: {
    type: Number,
    require: true,
  },
  paranoid: {
    type: Number,
    require: true,
  },
  cinsel: {
    type: Number,
    require: true,
  },
  okb: {
    type: Number,
    require: true,
  },
  demans: {
    type: Number,
    require: true,
  },
  madde: {
    type: Number,
    require: true,
  },
  yeme: {
    type: Number,
    require: true,
  },
  mutlu: {
    type: Number,
    require: true,
  },
  tiksinmis: {
    type: Number,
    require: true,
  },
  uzgun: {
    type: Number,
    require: true,
  },
  normal: {
    type: Number,
    require: true,
  },
  kizgin: {
    type: Number,
    require: true,
  },
  korkmus: {
    type: Number,
    require: true,
  },
  sasirmis: {
    type: Number,
    require: true,
  },
});

module.exports = mongoose.model("talk", talkSchema);
