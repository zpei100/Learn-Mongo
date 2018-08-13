var {mongoose} = require('../db/mongoose.js');

var User = mongoose.model('user', {
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 1
	}
});

module.exports = {User}