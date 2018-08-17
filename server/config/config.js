var env = process.env.NODE_ENV || 'development';
//heroku sets NODE_ENV to production, while test sets it to test: we did this in package.json

if (env === 'development') {
	process.env.PORT = 3000;
	process.env.MONGODB_URI = `mongodb://localhost:27017/todoApp`;	
} else if (env === 'test') {
	process.env.PORT = 3000;
	process.env.MONGODB_URI = `mongodb://localhost:27017/todoAppTest`;
} else if (env === 'production') {
	process.env.MONGODB_URI = `mongodb://zpei100:Gmlegend2@ds121312.mlab.com:21312/learn-node-zpei100`;
}