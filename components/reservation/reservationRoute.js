const express = require('express');
const router = express.Router();
const reservationController = require('./reservationController');

router.get('/find/id/:id',reservationController.find);
router.delete('/delete/:id',reservationController.delete);
router.get('/match/id/:id',reservationController.match);
router.get('/lookup/',reservationController.lookup);
router.post('/lookup_doktor/:id',reservationController.lookup_doktor);
router.get('/find/match',reservationController.findSpecific);
router.get('/find',reservationController.findID);
router.post('/add', reservationController.add);
router.get('/after', reservationController.lastDay);
router.get('/before', reservationController.beforeDay);
router.get('/totalClient',reservationController.totalClient);


module.exports = router;