const express = require("express");
const router = express.Router();
const ClientController = require("./clientController");

router.get("/clients", ClientController.all);
router.delete("/remove/:id", ClientController.delete);
router.put("/update/:id", ClientController.update);
router.get("/find", ClientController.findSpecific);
router.get("/find/:id", ClientController.find);
router.put("/reset/pass", ClientController.passUpdate);
router.put("/favori", ClientController.favoricreate);
router.get("/favori/lookup_favori/:id", ClientController.lookup_favori);
router.put("/favori/delete", ClientController.favoridelete);

module.exports = router;
