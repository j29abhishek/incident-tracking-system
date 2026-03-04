const express=require('express');
const { signUp, login, getMe, getEngineers } = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');


const router=express.Router();

router.post('/signup',signUp);
router.post('/login', login);
router.get('/me',verifyToken,getMe);
router.get('/engineers',verifyToken,checkRole(['admin']),getEngineers)

module.exports=router;