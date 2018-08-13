const expect = require('expect');
const request = require('supertest');

const {app} = require('../server.js');
const {Todo} = require('../models/todo.js');

//before each test, clear Todo collection
beforeEach((done) => {
	Todo.remove({}).then(() => {
		done();
	})
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
				Todo.find().then((todos) => {
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
						expect(todos.length).toBe(0);
						done();
					}).catch((e) => done(e));
				});
		})
});
