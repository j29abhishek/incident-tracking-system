const express=require('express');
const verifyToken = require('../middleware/verifyToken');
const { reportIncident, assignIncident, engineerAction } = require('../controllers/incidentController');
const checkRole = require('../middleware/checkRole');
const router=express.Router();

router.post('/',verifyToken,reportIncident);
router.put('/assign/:id',verifyToken,checkRole(['admin']),assignIncident);
router.put('/engineer-action/:id',verifyToken,checkRole(['admin','engineer']),engineerAction);

module.exports= router;