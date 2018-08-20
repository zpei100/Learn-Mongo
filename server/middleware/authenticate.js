var {User} = require ('../models/user.js');

var authenticate = (req, res, next) => {
	//in our test, we manually inputed the 'x-auth', value=token pair in postman to make the request 
	//this will probably be changed later
	var token = req.header('x-auth');

	//findByToken is a custom method. See ../models/user.js
	//program verifies the token, then attempts to find it and return the user document to the client
	User.findByToken(token).then((user) => {
		if (!user) {
			return Promise.reject();
			//automatically returns an error, that will be caught
		}
		req.user = user;
		req.token = token;
		next();
	}).catch((e) => {
		res.status(401).send();
	})	
};

module.exports = {authenticate};