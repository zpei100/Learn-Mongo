const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

//the server that mongoose connects to depends on the process environment:
//whehter it is testing, development, or production
mongoose.connect(process.env.MONGODB_URI);

module.exports = {mongoose}

