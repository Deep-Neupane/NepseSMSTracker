

function smsParser(sms){

    try{
        const netInformation = [];
        if(sms.trim()===""){
            throw new Error("SMS is empty");
        }
        if(!sms.includes('(') || !sms.includes(')')){
            throw new Error("Invalid SMS format - missing parentheses");
        }
        const tradeStatus = sms[7];
        let type;
        if(tradeStatus==="P")
            type="buy";
        else
            type="sell"; 

        const extracted = sms.split('(')[1].split(')')[0];
        const finalExtracted = extracted.split(",");
        const pattern =/\d{4}-\d{2}-\d{2}/;
        const dateMatch = sms.match(pattern);
        if(!dateMatch){
            throw new Error("SMS doesnot contain valid date");
        }
        const date = dateMatch[0];

        

        finalExtracted.forEach((item)=>{
            const symbol = item.split(" ")[0];
            const quantity = item.split(" ")[1].split("@")[0];
            const price = item.split("@")[1];

            if(Number(quantity)<=0 || Number(price)<=0){
                throw new Error("negative values detected");
            }

            netInformation.push({
                symbol,
                quantity:Number(quantity),
                price:Number(price),
                type,
                date
            })
        })

    return netInformation;
    }catch(err){
        throw err;
    }
    

}

module.exports = smsParser;