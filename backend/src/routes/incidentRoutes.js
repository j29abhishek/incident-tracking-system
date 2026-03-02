const express=require('express');
const verifyToken = require('../middleware/verifyToken');
const { reportIncident, assignIncident, engineerAction, getIncidentHistory, getIncidents, getUserIncidents } = require('../controllers/incidentController');
const checkRole = require('../middleware/checkRole');
const router=express.Router();

router.post('/report',verifyToken,reportIncident); //
router.get('/',verifyToken,getIncidents);
router.put('/assign/:id',verifyToken,checkRole(['admin']),assignIncident);
router.put('/engineer-action/:id',verifyToken,checkRole(['admin','engineer']),engineerAction);
router.get('/user/:id',verifyToken,getUserIncidents);

//get incident history route

router.get('/history/:id',verifyToken,getIncidentHistory);

module.exports= router;