const completedTradesModel = require('../models/completedTrades.model');

async function getSoldStocks(req,res){
    const prevHoldings = await completedTradesModel.find();
    if(prevHoldings.length===0){
        res.status(201).json({
        message:"no stocks sold yet ",   
        })
    }else{
        res.status(200).json({
            message:"sold stocks fetched successfully",
            trades:prevHoldings,
        })
    }
}

module.exports={getSoldStocks}