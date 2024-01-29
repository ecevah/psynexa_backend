const express = require("express");
const router = express.Router();
const talkController = require("./talkController");

router.post("/create/:id", talkController.createTalk);
router.get("/find/id", talkController.find);
router.get("/find/reservation", talkController.getTalkByReservationId);
router.get("/pdfgeneretor", talkController.generatePdf);

module.exports = router;
