const express=require('express');
const verifyToken = require('../middleware/verifyToken');
const { reportIncident, assignIncident, engineerAction, getIncidentHistory, getIncidents, getUserIncidents, getIncidentById, getAssignedIncidents } = require('../controllers/incidentController');
const checkRole = require('../middleware/checkRole');
const router=express.Router();

router.post('/report',verifyToken,reportIncident); //
router.get('/',verifyToken,getIncidents);
router.put('/engineer-action/:id',verifyToken,checkRole(['admin','engineer']),engineerAction);
router.get('/user',verifyToken,getUserIncidents);
router.get('/assignedto',verifyToken,checkRole(['admin','engineer']),getAssignedIncidents);
router.get('/:id',verifyToken,getIncidentById)
router.put('/assign/:id',verifyToken,checkRole(['admin']),assignIncident);
//get incident history route

router.get('/history/:id',verifyToken,getIncidentHistory);

module.exports= router;