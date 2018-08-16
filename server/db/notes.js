const mongoose = require('mongoose');

// configure moongose, use javascript's own promise features
mongoose.Promise = global.Promise;

// make connection

mongoose.connect('mongodb://localhost:27017/todoApp');

// create a new model for documents, so they share some common fields and structure 
// mongoose.model returns a constructor function named: todo
var todo = mongoose.model('todo', {
	// this argument is actually a schema, which can be created outside of the .model method:
	// const {Schema} = require('mongoose')
	// schema = new Schema
	// schema add structure, and acts like a schema...

	// it is possible to just say: text: String, completed....
	// if the value is not an object, it is defaulted to be equal to type: String
	text: {
		//options. 
		// the type property will type cast to schematypes like: string, number, date, buffer, boolean, mixed, objectid, array, decimal128, map etc... (all capitalized)
		type: String,
		//text is required to create new todo document
		required: true,
		//minlength is minimum length
		minlength: 1,
		//remove white spaces
		trim: true
	}, 
	completed: {
		type: Boolean,
		default: false
	}, 
	completedAt: {
		type: Number,
		default: null
	}	
});

// creates a new instance of the todo class
// these instances can access the database server defined by mongoose.connect()
// think of todo as a class, where the fields are its properties
var newTodo = new todo({
	text: 'Cook dinner'
}); 

// all instances have accesses to some methods, namely: save() that saves it to the database
// save returns a promise, as it is async
newTodo.save().then((result) => {
	console.log('saved todo', result);
}, e => {
	console.log('unable to save todo');
});


var otherTodo = new todo({
	text: 'Learn mongoose'
});

otherTodo.save().then((result) => {
	console.log(result);
});

var User = mongoose.model('user', {
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 1
	}
});

var user1 = new User({
	email: 'zhengqing.pei@gmail.com'
});

// console.log(1)
// this is to show .save() is async, and thus returns a promise
user1.save();
// console.log(2)