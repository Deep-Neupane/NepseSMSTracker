const express = require('express');
const portfolioController = require('../controllers/portfolio.controller');
const router = express.Router();


router.post("/trades",portfolioController.addToPorfolio);
router.get("/portfolio",portfolioController.getPortfolio);



module.exports=router;