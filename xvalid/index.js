"use strict";

// formular is using for check data type
const formular = {
	email: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
	url: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
	integer: /^\d+$/,
	real: /^[+-]?\d+(\.\d+)?$/,
	alphabet: /^[a-zA-Z]*$/,
	alphanumeric: /^[a-z0-9]+$/i
};

const equation = {
	equal(left, right) {
		return _equation(left, right, function(a, b) {
			return ( a === b );
		});
	},
	less(left, right) {
		return _equation(left, right, function(a, b) {
			return ( a < b );
		});
	},
	lessEqual(left, right) {
		return _equation(left, right, function(a, b) {
			return ( a <= b );
		});
	},
	greater(left, right) {
		return _equation(left, right, function(a, b) {
			return ( a > b );
		});
	},
	greaterEqual(left, right) {
		return _equation(left, right, function(a, b) {
			return ( a >= b );
		});
	}
};
 

// flag is using for data has following the rules
const flag = {
	required: _checkNotEmpty
};

// param is similar with flag, but has argument
const param = {
	min: equation.greaterEqual,
	max: equation.lessEqual,
	eq: equation.equal
};

formular['numeric'] = formular['number'] = formular.real;
formular['string'] = formular['alphanumeric'];

//equations
function _equation(left, right, fn) {
	return fn(parseFloat(left), parseFloat(right));
}

//utility functions
function _isFormula(str) {
	return ( typeof formular[str] !== 'undefined' ); 
}
function _isFlag(str) {
	return ( typeof flag[str] !== 'undefined' );
}
function _isParam(str) {
	var split = str.split(":");
	return ( split.length >= 2 && typeof param[split[0]] !== 'undefined');
}

//_checkFormular(string str, str type): Check the str is correct type
function _checkFormular(str, type) {
	
	// check formular exists
	let found = false;
	for(var key in formular) {
		if(key === type) {
			found = true;
			break;
		}
	}
	
	if(!found) {
		throw new Error('unsupported validation type ' + type);
	}

	return ( formular[type].test(str) );
}

//_checkEmpty(string str): Check str is empty
function _checkEmpty(str) {
	return (typeof str === 'undefined' || str === '' || str === null);
}

//_checkNotEmpty(string str): Check str is not empty
function _checkNotEmpty(str) {
	return !_checkEmpty(str);
}


function _is(value, type, detailMode) {
	//split strings into array. delimeter is '|'
	var splited = type.toString().trim().split('|');
	var vPassed = true;					// returns if not detail mode
	var returnObj = { passed: true };	// returns if detail mode
	
	for(var i = 0, len = splited.length; i < len; i++) {
		//three types can be done:
		//1. formular which likes 'number', 'url', 'email'...
		//2. flags which likes 'required'
		//3. parameter conditions
		var splitItem = splited[i];
		
		//if it is fomular, check it is correct
		if(_isFormula(splitItem)) {
			if(!_checkFormular(value, splitItem)) {
				if(detailMode) {
					returnObj = {
						passed: false,
						reason: splitItem + ' expects ' + splitItem + ' formular(s).'
					}
				}
				else {
					vPassed = false;
				}
					
				break;
			}
		}
		//if it is flags, check
		else if(_isFlag(splitItem)) {
			var flagFunc = flag[splitItem];
			
			if(!flagFunc(value)) {
				if(detailMode) {
					returnObj = {
						passed: false,
						reason: str + ' expects ' + flagFunc + ' option(s).'
					}
				}
				else {
					vPassed = false;
				}
				
				break;
			}
		}
		//if it is parameters, check
		else if(_isParam(splitItem)) {
			var params = splitItem.split(":");
			var cond = param[params[0]];
			var v = params[1];
			var str = value.toString();
			
			if( !cond(str.length, v) ) {
				if(detailMode) {
					returnObj = {
						passed: false,
						reason: 'expects field ' + splitItem + ' but value is ' + str
					}
				}
				else {
					vPassed = false;
				}
				break;
			}
		}
		else {
			throw new Error('unsupported validation token ' + splitItem);
		}
	}
	
	return (detailMode) ?
		 	returnObj : vPassed;
}

const validator = {
	//is(string str, string type): Validate type of the string
	is(str, type) {
		return _is(str, type, false);
	},
	//check(string str, string type): Same as Validator.is.
	check(str, type) {
		return this.is(str, type);
	},
	//checkDetail(string str, string type): Same as Validator.is, but returns specific information.
	checkDetail(str, type) {
		return _is(str, type, true);
	},
	//empty(string str): Returns true if the string is empty or null or undefined
	empty(str) {
		return _checkEmpty(str);
	},
	//checkIfNotEmpty(string str, string type): Check the string type if it is not empty. Empty just returns true.
	checkIfNotEmpty(str, type) {
		if(_checkNotEmpty(str)) {
			return _is(str, type, false);
		}

		return true;
	},
	//checkDetailIfNotEmpty(string str, string type): Check the string type if it is not empty.
	checkDetailIfNotEmpty(str, type) {
		if(_checkNotEmpty(str)) {
			return _is(str, type, true);
		}
		
		return { passed: true };
	},
	//evaluate(string eq, int left, int right): Evaluate equation. this method available to evalute custom added equations.
	evaluate(eq, left, right) {
		return equation[eq](left, right);
	},
	//less(int left, int right): Check left is less than right
	less(left, right) {
		return equation.less(left, right);
	},
	//lessEqual(int left, int right): Check left is less / equal than right
	lessEqual(left, right) {
		return equation.lessEqual(left, right);
	},
	//greater(int left, int right): Check left is greater than right
	greater(left, right) {
		return equation.greater(left, right);
	},
	//greaterEqual(int left, int right): Check left is greater / equal than right
	greaterEqual(left, right) {
		return equation.greaterEqual(left, right);
	},
	//length(string str, string comparator, int len): Check the str length with comparator
	length(str, comparator, len) {
		comparator = comparator || '=';
		len = len || 0;
		
		var compFunc = {
			'<': equation.less,
			'<=': equation.lessEqual,
			'>': equation.greater,
			'>=': equation.greaterEqual,
			'=': equation.equal,
		};
		
		if(typeof compFunc[comparator] === 'undefined') {
			throw new Error('unsupported length comparator ' + comparator);
		}
		
		return compFunc[comparator](str.length, len);
	}
};

function AutoValidator(options) {
	options = options || {};
	this.exps = options.exps || {};
}
AutoValidator.prototype.check = function(fields) {
	
	return new Promise( (resolve, reject) => {
		for(let key in this.exps) {
			let exp = this.exps[key];
			let value = fields[key];
			
			// if field does not exists,
			if(typeof value === 'undefined') {
				
				// if validate expression not contains 'require', pass
				if(exp.indexOf('require') === -1) {
					continue;
				}
				// else, you need it! error!!
				else {
					reject({
						field: key,
						value: value,
						reason: key + ' field expects not empty.'
					});
					break;
				}
			}
			
			// check it is valid
			let result = validator.checkDetail(value, exp);
			
			if(!result.passed) {
				reject({
					field: key,
					value: value,
					reason: result.reason
				});
				break;
			}
		}
		
		resolve();
	});
	
};


module.exports = {
	createAutoValidator: function(options) {
		options = options || {};
		return new AutoValidator(options);
	},
	createFormular: function(name, regex) {
		formular[name] = regex;
	},
	createEquation: function(name, eq) {
		equation[name] = eq;
	},
	_equation: _equation,
	is: validator.is,
	check: validator.check,
	checkDetail: validator.checkDetail,
	empty: validator.empty,
	checkIfNotEmpty: validator.checkIfNotEmpty,
	checkDetailIfNotEmpty: validator.checkDetailIfNotEmpty,
	less: validator.less,
	lessEqual: validator.lessEqual,
	greater: validator.greater,
	greaterEqual: validator.greaterEqual,
	length: validator.length,
	evaluate: validator.evaluate
};