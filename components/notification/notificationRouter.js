const express = require("express");
const router = express.Router();
const notificationController = require("./notificationController");

router.post("/create", notificationController.create);
router.get("/find", notificationController.find);

module.exports = router;
