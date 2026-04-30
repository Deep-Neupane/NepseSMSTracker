


function calculateNEPSE(individualBuyPrice,individualDate,individualQuantity,sellDate,quantity,sellPrice){
    let buyAmount=0;
    const sellAmount = Number(quantity)*Number(sellPrice);
    for(let i = 0; i < individualDate.length;i++){
        buyAmount += individualBuyPrice[i]*individualQuantity[i];        
    }
    const transactionAmount = buyAmount+sellAmount;
    const brokerCommission = ((transactionAmount)=>{
        switch(true){
            case transactionAmount<=50000:
                return transactionAmount*0.36*0.01;
            case transactionAmount<=500000:
                return transactionAmount*0.33*0.01;
            case transactionAmount<=2000000:
                return transactionAmount*0.31*0.01;
            case transactionAmount<=10000000:
                return transactionAmount*0.27*0.01;
            default:
                return transactionAmount*0.24*0.01;
        }
    })(transactionAmount);
    const brokerCharge = brokerCommission+50;
    const capitalGain= sellAmount-buyAmount;
    let capitalGainsTax = 0;
     if(capitalGain>0){
        for(let i=0;i<individualDate.length;i++){
            const profitPerUnit = sellPrice-individualBuyPrice[i];
            const startDate = new Date(individualDate[i]);
            const endDate = new Date(sellDate);
            const timeHeld = endDate-startDate;
            const miliSecInYear = 1000 * 86400 * 365;
            if(timeHeld>=miliSecInYear){
                const rate = 5*0.01;
                capitalGainsTax+=profitPerUnit*individualQuantity[i]*rate;
            }else{
                const rate = 7.5*0.01;
                capitalGainsTax+=profitPerUnit*individualQuantity[i]*rate;
            }

        }
     }
     const netProfit = capitalGain - brokerCharge - capitalGainsTax;


     return {netProfit,capitalGainsTax,brokerCharge};

}

module.exports = calculateNEPSE;