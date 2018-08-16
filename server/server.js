var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');
var {ObjectID} = require('mongodb');

var express = require('express');
var bodyParser = require('body-parser')

//creates local server
var app = express();

//process.env.PORT will exist when deployed to heroku,
//and the server will listen to that port instead
const port = process.env.PORT || 3000;

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
})







app.listen(port, () => {
	console.log(`Started on port ${port}`);
});

module.exports = {app};