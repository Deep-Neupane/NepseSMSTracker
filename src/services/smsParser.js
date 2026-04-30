

function smsParser(sms){

    const netInformation = [];

    const tradeStatus = sms[7];
    let type;
    if(tradeStatus==="P")
        type="buy";
    else
        type="sell"; 

    const extracted = sms.split('(')[1].split(')')[0];
    const finalExtracted = extracted.split(",");
    const pattern =/\d{4}-\d{2}-\d{2}/;
    const date = sms.match(pattern)[0];

    

    finalExtracted.forEach((item)=>{
        const symbol = item.split(" ")[0];
        const quantity = item.split(" ")[1].split("@")[0];
        const price = item.split("@")[1];


        netInformation.push({
            symbol,
            quantity:Number(quantity),
            price:Number(price),
            type,
            date
        })
    })

    return netInformation;

}

module.exports = smsParser;