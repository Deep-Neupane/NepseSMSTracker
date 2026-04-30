const express = require('express');
const completedTradesController = require('../controllers/completedTrades.controller');
const router = express.Router();


router.get("/soldStocks",completedTradesController.getSoldStocks);



module.exports=router;