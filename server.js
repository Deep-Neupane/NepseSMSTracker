require('dotenv').config();
const connectDB=require('./src/db/db');
const app = require('./src/app');


connectDB();


const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log("server has started");
})