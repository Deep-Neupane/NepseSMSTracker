const mongoose = require('mongoose');

const portfolioSchema =  new mongoose.Schema({
    symbol:{
        type:String,
        required:true,
    },
    quantity:{
        type:Number,
        required:true
    },
    buyPrice:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        required:true
    }
})

const portfolioModel = mongoose.model("portfolio",portfolioSchema);

module.exports=portfolioModel;