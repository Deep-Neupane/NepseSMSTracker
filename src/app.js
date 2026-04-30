const express = require('express');
const portfolioRoutes = require('./routes/portfolio.routes');
const completedTradesRoutes = require('./routes/completedTrades.routes');
const cors = require('cors');



const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));




app.use('/api',portfolioRoutes);
app.use('/api',completedTradesRoutes);




module.exports = app;