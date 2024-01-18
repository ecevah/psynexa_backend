const express = require("express");
const router = express.Router();
const talkController = require("./talkController");

router.post("/add", talkController.createTalk);
router.get("/find/id", talkController.find);
router.get("/find/reservation", talkController.getTalkByReservationId);

module.exports = router;
