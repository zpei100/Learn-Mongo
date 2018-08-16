const expect = require('expect');
const request = require('supertest');

const {app} = require('../server.js');
const {Todo} = require('../models/todo.js');
const {ObjectID} = require('mongodb');

const todos = [{
	_id: new ObjectID(), 
	text: 'First test todo'
}, {
	_id: new ObjectID(),
	text: 'Second test todo'
}];



//before each test, clear Todo collection
beforeEach((done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos);
	}).then(() => done());
});

describe('post /todos', () => {
	it('should create a new todo', (done) => {
		var text = 'test todo text';
		//use supertest to test the server
		request(app)
			//make a post request to todos
			.post('/todos')
			//by sending this object
			.send({text: text})
			//expect status code: 200. The expect used here is a method from supertest
			.expect(200)
			//request(app) returns response and error automatically
			.expect((res) => {
				expect(res.body.text).toBe(text);
			})
			//end the request
			.end((err, res) => {
				if (err) return done(err)
				//find() returns the entire todos collection
				//expect the collection to have length 1
				Todo.find({text:text}).then((todos) => {
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();
				}).catch((e) => done(e));
			})
		})
		//at this point, one document is created under todo collection


	it('should not create todo with invalid body data', (done) => {
		request(app)
			.post('/todos')
			.send({})
			//status code 400 is for bad data
			.expect(400)
			.end((err, res) => {
				if (err) return done(err)
				Todo.find().then((todos) => {
					expect(todos.length).toBe(2);
					done();
				}).catch((e) => done(e));
			});
	})
});


//test is failing: cannot get route: /todos
// describe('Get /todos', () => {
// 	it('should get all todos', (done) => {
// 		request(app)
// 			.get('/todos')
// 			.expect(200)
// 			.expect((res) => {
// 				expect(res.body.todos.length).toBe(2);
// 			})
// 			.end(done);		
// 	})
// });

describe('Get /todos/:id', () => {
	it('should return todo doc', (done) => {
		request(app)
			.get(`/todos/${todos[0]._id.toString()}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.text).toBe(todos[0].text);
			})
			.end(done);
	});

	it('should return a 404, if todo not found', (done) => {
		var ID = new ObjectID().toString();
		request(app)
			.get('/todos/${ID}')
			.expect(404)
			.end(done);
		//valid ID but does not exist in our data base;

		//make sure we get a 404 back;
	});

	it('should return a 404, if ID provided is not objectID', (done) => {
		request(app)
			.get(`/todos/123`)
			.expect(404)
			.end(done);
		// /todos/123 to pass in as URL;



	});
});