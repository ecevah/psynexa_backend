const express = require('express');
const router = express.Router();
const commentController = require('./commentController');

router.post('/add', commentController.add);
router.get('/find',commentController.find);
router.get('/findAnd',commentController.findAnd);
router.get('/totalComment',commentController.totalComment);
module.exports = router;