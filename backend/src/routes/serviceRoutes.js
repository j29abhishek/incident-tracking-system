const express = require('express');
const { createService, getServices, updateService, deleteService } = require('../controllers/serviceController');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');

const router = express.Router();

// POST /create-service → only admin can create
router.post('/', verifyToken, checkRole(["admin"]), createService);
router.get('/',verifyToken,getServices);
router.put('/:id',verifyToken,checkRole(['admin']),updateService);
router.delete('/:id',verifyToken,checkRole(['admin']),deleteService);

module.exports = router;