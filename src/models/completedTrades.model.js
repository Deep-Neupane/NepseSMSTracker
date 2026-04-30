const mongoose = require('mongoose');

const completedTradesSchema =  new mongoose.Schema({
    symbol:{
        type:String,
        required:true,
    },
    quantity:{
        type:Number,
        required:true
    },
    buyPrice:{
        type:[Number],
        required:true
    },
    sellPrice:{
        type:Number,
        required:true
    },
    buyDate:{
        type:[Date],
        required:true
    },
    sellDate:{
        type:Date,
        required:true
    },
    netProfit:{
        type:Number,
        required:true
    },
    capitalGainsTax:{
        type:Number,
        required:true
    },
    brokerCharge:{
        type:Number,
        required:true
    },
    
})

const completedTradesModel = mongoose.model("completedTrades",completedTradesSchema);

module.exports=completedTradesModel;