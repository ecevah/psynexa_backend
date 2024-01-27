const videosModel = require("./videosModel");
const path = require("path");
const multer = require("multer");
const mongoose = require("mongoose");

const videosController = {
  create: async (req, res) => {
    try {
      const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, "public/uploads/videos");
        },
        filename: function (req, file, cb) {
          cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
          );
        },
      });
      /*
      const fileFilter = (req, file, cb) => {
        if (file.mimetype.startsWith("video/")) {
          cb(null, true);
        } else {
          cb(new Error("Only video files are allowed."), false);
        }
      };*/

      const upload = multer({
        storage: storage,
      }).single("media");

      upload(req, res, async (err) => {
        if (err) {
          return res.json({
            status: false,
            message: "Not Added",
            error: err,
          });
        } else {
          const newVideo = await videosModel.create({
            reservation_id: req.body.reservation_id,
            fileName: req.file.filename,
          });
          return res.json({
            status: true,
            message: "Added",
            value: newVideo,
          });
        }
      });
    } catch (err) {
      return res.json({
        status: false,
        message: "Not Added",
        err: err.message,
      });
    }
  },
};

module.exports = videosController;
