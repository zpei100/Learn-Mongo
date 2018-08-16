const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var connectMLab = `mongodb://zpei100:Gmlegend2@ds121312.mlab.com:21312/learn-node-zpei100`
mongoose.connect(connectMLab || 'mongodb://localhost:27017/todoApp');

module.exports = {mongoose}
