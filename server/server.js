require('./config/config.js');

//process.env.PORT will exist when deployed to heroku,
//note: this issue is addressed in the config file, using if statements
//based on process.env.NODE_ENV
//and the server will listen to that port instead
var port = process.env.PORT

//importing
var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');
var {ObjectID} = require('mongodb');
var {authenticate} = require('./middleware/authenticate.js');

var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');

//creates local server
var app = express();

//use bodyParser as middleware to make changes to request and response
//before they are handled. 
//I think this calls toJSON to our bodies in req and res
app.use(bodyParser.json());

//defines what happens when a post request is made to the route: /todos
app.post('/todos', (req, res) => {
	//creates a new todo document in our mongo database, inside todo collection
	var todo = new Todo({
		//sets the text field to the text property, of the request body, which is parsed
		text: req.body.text
	});

	//save the document inside the mongo database
	//again, save() returns a promise with the resolve being doc
	//and error
	todo.save().then((doc) => {
		//server responds by sending back the document we saved
		//it contains extra information such as copmletedAt, completed, objectID etc...
		res.send(doc);
	}, (e) => {
		res.status(400).send(e);
	});
});

app.get('/', (req, res) => {
	console.log(req.body);
	res.send('Hello visiter!');
});

app.get('/todos', (req, res) => {
	Todo.find().then((docs) => {
		res.send(docs);
	}).catch((e) => 
	res.status(400).send());
})

app.get('/todos/:id', (req, res) => {
	var id = req.params.id;
	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	Todo.findById(id).then((doc) => {
	  if(!doc) {
	  	return res.status(404).send();
	  }
	  res.status(200).send(doc);
	}).catch((e) => {
		res.status(400).send();
	});
});

app.delete('/todos/:id', (req, res) => {
	var id = req.params.id;
	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	Todo.findByIdAndRemove(id).then((todo) => {
		if(!todo) {
			return res.status(404).send();
		}
		res.send(todo);
	}).catch((e) => {
		res.status(400).send();
	})
})

app.patch('/todos/:id', (req, res) => {
	var id = req.params.id;
	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	var body =_.pick(req.body, ['text', 'completed']);

	//pick returns an object that only has the above properties
	//basically, we are ignoring all other properties and don't want 
	//to pass them to the server
	//for example, we dont want the user to send the completedAt value
	//we should set that, based on when the update is sent

	//if the value is a boolean and it is true:
	if (_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime();
	} else {
		//if the user sends the value to be something weird, and not the value true
		//we wanna reset the value to be false
		body.completed = false;
		//clears the field / value of completedAt
		body.completedAt = null;
	}

	//the way the arguments are passed in does make sense:
	//it would be like in python: 
	//set={an object}
	//new={an object}
	//if we dont use that format, we are just passing in objects
	//which is confusing
	//new is the same as returnOriginal -- mongoose wanted to use this ~~
	Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
		if (!todo) {
			return res.status(404).send();
		}
		res.send(todo);
	}).catch((err) => {
		res.status(400).send();
	})
});

app.post('/users', (req, res) => {

	//create a new user using the email and password fields of the request body
	var body =_.pick(req.body, ['email', 'password']);	
	var user = new User(body);

	//even though generateAuthToken has .save() in its definition
	//it returns a token, and not a promise
	//therefore if we we initiate with user.save(), this returns a promise, that has resolve value: token
	//which can then be chained by then(token)

	//stores the user into the database
	user.save().then((user) => {
		//generate token for the user and store [access, token] into user's tokens array
		//later authorizations do not need password anymore, but instead uses the token to authorize
		return user.generateAuthToken();
		//returns resolve(token)
	}).then((token) => {
		//sets the header, and sends back user
		res.header('x-auth', token).send(user);
	}).catch((err) => res.status(400).send(err));
});

app.get('/users', (req, res) => {
	User.find().then((users) => {
		res.send(users);
	}).catch((err) => res.status(400).send(err));
});


//testground private route
//defines what happens when client sends a get request to this route
//middleware function: authenticate fires before the callback. It automatically passes in (req, res, next); The program knows it is middleware
//see ./middleware/authenticate.js
app.get('/users/me', authenticate, (req, res) => {
	res.send(req.user);
});


app.post('/users/login' , (req, res) => {
	var body = _.pick(req.body, ['email', 'password']);
	//server verifies user info. If succeeds, generates a token,
	//send it to the user along with other things
	User.findByCredentials(body.email, body.password).then((user) => {
		return user.generateAuthToken().then((token) => {
			res.header('x-auth', token).send(user);
		})
	}).catch((err) => {
		res.status(400).send();
	})
});














//make app listen to whatever port is appropriate based on process environment
app.listen(port, () => {
	console.log(`App started on port: ${port}`)
});
		
module.exports = {app};