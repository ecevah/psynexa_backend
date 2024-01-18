const express = require("express");
const router = express.Router();
const testController = require("./testController");

router.post("/create", testController.create);
router.put("/update/:testId", testController.update);

module.exports = router;
