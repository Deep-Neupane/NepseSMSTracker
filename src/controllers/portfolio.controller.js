const portfolioModel = require('../models/portfolio.model');
const completedTradesModel = require("../models/completedTrades.model");
const parseSMS= require('../services/smsParser');
const nepseCalculations = require("../services/nepseCalculations");

async function addToPorfolio(req,res){
    try{
    const sms = req.body.sms;
    const trades = parseSMS(sms);
    const savedTrades = [];

    for(let trade of trades){
        if(trade.type==="buy"){
            const stock = await portfolioModel.create({
                symbol:trade.symbol,
                quantity:trade.quantity,
                buyPrice:trade.price,
                date:trade.date
            })
            savedTrades.push(stock);
        }else{
            
    
            const individualBuyPrice=[];
            const individualQuantity=[];
            const individualDate=[];
            const soldStock = await portfolioModel.find({symbol:trade.symbol}).sort({date:1});
            const totalQuantity = (()=>{
                let quantity=0;
                for(let entry of soldStock){
                    quantity+=entry.quantity;
                    
                }
                return quantity;
            })();
            const remainingQuantity= totalQuantity-trade.quantity;
            
            if(remainingQuantity===0){
                await portfolioModel.deleteMany({symbol:trade.symbol});
                for(let entry of soldStock){
                    individualBuyPrice.push(entry.buyPrice);
                    individualQuantity.push(entry.quantity);
                    individualDate.push(entry.date);
                }
            }else{
                let tempQuantity=trade.quantity;
                for(let i=0;i<soldStock.length && tempQuantity>0;i++){
                    const id=soldStock[i]._id;
                    if(soldStock[i].quantity<=tempQuantity){
                        tempQuantity-=soldStock[i].quantity;
                        individualBuyPrice.push(soldStock[i].buyPrice);
                        individualQuantity.push(soldStock[i].quantity);
                        individualDate.push(soldStock[i].date);
                        await portfolioModel.findByIdAndDelete(id);
                    }
                    else{
                        individualQuantity.push(tempQuantity);  
                        individualBuyPrice.push(soldStock[i].buyPrice);
                        individualDate.push(soldStock[i].date);
                        const remainingQty = soldStock[i].quantity - tempQuantity;  
                        await portfolioModel.findByIdAndUpdate(id, {quantity: remainingQty});  
                        tempQuantity = 0;  
                    }
                }
            }
            const {netProfit , capitalGainsTax , brokerCharge}= nepseCalculations(individualBuyPrice,individualDate,individualQuantity,trade.date,trade.quantity,trade.price);
            const stock = await completedTradesModel.create({
                symbol:trade.symbol,
                quantity:trade.quantity,
                buyPrice:individualBuyPrice,
                sellPrice:trade.price,
                buyDate:individualDate,
                sellDate:trade.date,
                netProfit,
                capitalGainsTax,
                brokerCharge
            })
            savedTrades.push(stock);
            
        }
    }
    res.status(201).json({
            message:"trades added successfully",
        })
    }catch(err){
        console.log('ERROR in addToPorfolio:', err.message);
        res.status(400).json({ error: err.message })
    }

    

    
}

async function getPortfolio(req,res){
    try{
        const grouped = {};
        const portfolio = await portfolioModel.find();
        if(portfolio.length===0){
            res.status(201).json({
            message:"empty portfolio",        
        })
        }else{
            for(let stock of portfolio){
                if(grouped[stock.symbol]){
                    const prevTotalQuantity= grouped[stock.symbol].totalQuantity;
                    grouped[stock.symbol].totalQuantity+=stock.quantity;
                    grouped[stock.symbol].breakdown.push(stock);
                    grouped[stock.symbol].averagePrice=((grouped[stock.symbol].averagePrice*prevTotalQuantity)+(stock.buyPrice*stock.quantity))/grouped[stock.symbol].totalQuantity
                }else{
                    grouped[stock.symbol]={
                        symbol:stock.symbol,
                        totalQuantity:stock.quantity,
                        averagePrice:stock.buyPrice,
                        breakdown:[stock]
                    }
                }
            }

            const finalPortfolio=Object.values(grouped);

            res.status(200).json({
            message:"portfolio fetched successfully",
            portfolio:finalPortfolio,
        })
    }
    }catch(err){
        console.log('Error in getPortfolio:', err.message);
        res.status(500).json({ error: "Failed to fetch portfolio" });
    }
    
    
}

module.exports={addToPorfolio,getPortfolio}