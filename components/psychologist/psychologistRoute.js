const express = require ('express');
const router = express.Router();
const psychologistController = require('./psychologistController');

router.get('/psycs',psychologistController.all);
router.delete('/remove/:id', psychologistController.delete);
router.put('/update',psychologistController.update)
router.get('/test',psychologistController.test);
router.get('/find',psychologistController.findSpecific);
router.get('/find/:id',psychologistController.find);
router.put('/passupdate', psychologistController.passUpdate);
router.post('/createStar',psychologistController.createStar);
router.get('/siraStarAvg', psychologistController.siraStarAvg);
router.get('/active/find',psychologistController.activeFind);
router.put('/active/update',psychologistController.activeUpdate);
router.post('/deneme',psychologistController.deneme);
router.put('/adminupdate/:id', psychologistController.adminupdate);

module.exports = router;