var xvalid = require('./index.js');


// create custom formular
xvalid.createFormular('modernator', /modernator/);
console.log('Check custom formular: ' + xvalid.check('modernator is awesome', 'modernator'));

// create custom equation
xvalid.createEquation('same', (left, right) => {
	return left === right;
});
console.log('Check custom equation(left === right): ' + xvalid.evaluate('same', 1, 1));

// using auto validator
var validator = xvalid.createAutoValidator({
	exps: {
		id: 'number|required|min:3',
		password: 'number|required',
		email: 'email|required'
	}
});

validator.check({
	id: 500,
	password: 500,
	email: 'aaa'
})
.then(() => ( console.log('validation passed!') ))
.catch((error) => {
	console.log('----------- AutoValidator sent error -----------');
	console.log('field: ' + error.field);
	console.log('value: ' + error.value);
	console.log('reason: ' + error.reason);
});