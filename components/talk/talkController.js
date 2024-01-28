const talkModel = require("./talkModel");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const talkController = {
  createTalk: async (req, res) => {
    try {
      const existingTalk = await talkModel.findOne({
        reservation_id: req.body.reservation_id,
      });
      if (existingTalk) {
        return res.json({
          status: false,
          message: "Talk with the same reservation_id already exists.",
        });
      } else {
        const storage = multer.diskStorage({
          destination: function (req, file, cb) {
            cb(null, "public/uploads/graph");
          },
          filename: function (req, file, cb) {
            cb(
              null,
              file.fieldname +
                "-" +
                Date.now() +
                path.extname(file.originalname)
            );
          },
        });

        const upload = multer({
          storage: storage,
          fileFilter: function (req, file, cb) {
            if (file.mimetype.startsWith("image/")) {
              cb(null, true);
            } else {
              cb(new Error("Sadece resim dosyaları yüklenebilir."), false);
            }
          },
        }).array("images", 3);

        upload(req, res, async (err) => {
          if (err) {
            return res.json({
              status: false,
              message: "Not Added",
              error: err,
            });
          } else {
            const { reservation_id } = req.body;
            const disorder_rate_photo = req.files[0].filename;
            const head_move_photo = req.files[1].filename;
            const emotion_photo = req.files[2].filename;

            const newTalk = await talkModel.create({
              reservation_id,
              disorder_rate: disorder_rate_photo,
              head_move: head_move_photo,
              emotion: emotion_photo,
            });

            res.json({
              status: true,
              message: "Talk created successfully",
              talk: newTalk,
            });
          }
        });
      }
    } catch (err) {
      return res.json({
        status: false,
        message: "Not Added",
        err: err.message,
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
