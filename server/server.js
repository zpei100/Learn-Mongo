var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');
var {ObjectID} = require('mongodb');

var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');

//creates local server
var app = express();

//process.env.PORT will exist when deployed to heroku,
//and the server will listen to that port instead
var externalPort = process.env.PORT
const port = 3000;

//use bodyParser as middle to make changes to request and response
//before they are handled
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
	Todo.findByIdAndUpdate(id, {$set: {body}}, {new: true}).then((todo) => {
		if (!todo) {
			return res.status(404).send();
		}
		res.send(todo);
	}).catch((err) => {
		res.status(400).send();
	})


});



//set port 3000 and start server
//test mlab db server by visiting localhost routes to see if i can communicate with the deployed db server

//if statement prevents the program from listening to the port if 
//the program is ran in a testing environement, since:
//the tests would listen to the port on their own
//this is to prevent "double port listening"

if (process.env.NODE_ENV !== 'test') {
	app.listen(externalPort, () => {
		console.log(`Started on port ${externalPort}`);
	});

	module.exports = {app};
}