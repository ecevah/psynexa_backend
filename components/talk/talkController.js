const talkModel = require("./talkModel");
const mongoose = require("mongoose");

const talkController = {
  createTalk: async (req, res) => {
    try {
      const {
        reservation_id,
        depresyon,
        bipolar,
        borderline,
        agorafobi,
        parkinson,
        sosyalfobi,
        debh,
        paranoid,
        cinsel,
        okb,
        demans,
        madde,
        yeme,
        mutlu,
        tiksinmis,
        uzgun,
        normal,
        kizgin,
        korkmus,
        sasirmis,
      } = req.body;

      const newTalk = await talkModel.create({
        reservation_id,
        depresyon,
        bipolar,
        borderline,
        agorafobi,
        parkinson,
        sosyalfobi,
        debh,
        paranoid,
        cinsel,
        okb,
        demans,
        madde,
        yeme,
        mutlu,
        tiksinmis,
        uzgun,
        normal,
        kizgin,
        korkmus,
        sasirmis,
      });

      res.json({
        status: true,
        message: "Talk created successfully",
        talk: newTalk,
      });
    } catch (err) {
      res.json({
        status: false,
        message: "Talk creation failed",
        error: err.message,
      });
    }
  },

  getTalkByReservationId: async (req, res) => {
    try {
      const { id } = req.query;
      const talks = await talkModel
        .find({ reservation_id: id })
        .sort({ _id: 1 });
      res.json({
        status: true,
        message: "Talks retrieved successfully",
        talks,
      });
    } catch (err) {
      res.json({
        status: false,
        message: "Failed to retrieve talks",
        error: err.message,
      });
    }
  },
  find: async (req, res) => {
    try {
      const talk = await talkModel.findById(req.query.id);
      res.json({
        status: true,
        message: "Find Complated",
        talk,
      });
    } catch (err) {
      res.json({
        status: false,
        message: "Find Not Complated",
        err: err,
      });
    }
  },
};

module.exports = talkController;
