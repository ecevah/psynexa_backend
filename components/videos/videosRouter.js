const express = require("express");
const router = express.Router();
const videosController = require("./videosController");

router.post("/create", videosController.create);

module.exports = router;
