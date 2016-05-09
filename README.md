# xvalid: light weight, pure JavaScript validation module

github link: [https://github.com/rico345100/xvalid](https://github.com/rico345100/xvalid)

xvalid is light weight and pure JavaScript validation module. you can use it in "node.js" or "webpack" / "browserify".
it will be possible to create your own validations, but it is in development so you can't do it right now.
inside of xvalid contains lots of equations which use "equation function" to validate the equation. equation has three arguments, left formular, right fomular and equation function. it will be help to understand how this library works and possible, you create your own validate equation later.
xvalid module provide those methods:

* createAutoValidator
* createFormular
* createEquation
* is
* check
* checkDetail
* checkIfNotEmpty
* checkDetailIfNotEmtpy
* less
* lessEqual
* greater
* greaterEqual
* length
* evaluate

##

#### xvalid.createAutoValidator(Object options)**
create Auto validator that validate fields easily. internally, it create "AutoValidator" object and returns it.

```
var xvalid = require('xvalid');
var validator = xvalid.createAutoValidator({
    exps: {
        id: 'string|required',
        password: 'string|min:5|required'
    }
});

validator.check({
    id: 'johndoe',
    password: 'loremipsum',
})
.then( () => ( console.log('validation passed!') )
.catch( (error) => {
    console.log('----------- AutoValidator sent error -----------');
    console.log('field: ' + error.field);
    console.log('value: ' + error.value);
    console.log('reason: ' + error.reason);
});
```
    
AutoValidator only provides one method 'check' that validate key-valued object data with expressions. you must provide expressions when creating AutoValidator object with exps: { ... }.

supporting fomulars:
* email
* url
* integer
* number
* numeric
* real
* alphabet
* alphanumeric
* string

supporting flags and parameters:

* required
* min:N
* max:N


response of AutoValidator.check is promise object. you can catch the error with catch method.

```
validator.check({ ... })
.then(() => ( console.log('validation passed!') ))
.catch((error) => {
    console.log('----------- AutoValidator sent error -----------');
    console.log('field: ' + error.field);
    console.log('value: ' + error.value);
    console.log('reason: ' + error.reason);
});
```

rejected callback passes single argument: Error which contains:

* field: name of field that error occurs
* value: value of field
* reason: reason of invalidation
 
 
#### xvalid.createFormular(String name, RegExp formular)**
Create custom formular. once create it, you can use your formular in xvalid.check.

```
xvalid.createFormular('modernator', /modernator/');
console.log('Check custom formular: ' + xvalid.check('modernator is awesome!', 'modernator'));
```

#### xvalid.createEquation(String name, xvalid._equation equation)**
Create custom equation. xvalid._equation is a pure function that require only two params: int left and int right, and result must be boolean.

```
xvalid.createEquation('same', (left, right) => {
    return left === right;
});
console.log('Check custom equation(left === right): ' + xvalid.evaluate('same', 1, 1));
```

> custom equation only can execute with xvalid.evaluate method.


#### Boolean Validator.is(String str, String type)**
Validate type of the string. type is fomular which:
* email
* url
* integer
* number
* numeric
* real
* alphabet
* alphanumeric
* string


#### Boolean Validator.check(String str, String type)**
Same as Validator.is.


#### Object Validator.checkDetail(String str, String type)**
This method is similar to 'check' and 'is' method, but it returns specific data as object that validation is valid or not.
Returning value is object which contains:
* pass: Boolean that validation is passed
* field: Name of the field
* value: Value of the field
* reason: Reason why invalid.


#### Boolean Validator.checkIfNotEmpty(String str, String type)**
Validate only it has value. If not, it passes(returns true).


#### Boolean Validator.checkDetailIfNotEmpty(String str, String type)**
Validate only it has value. Using check detail on validating.


#### Boolean Validator.less(Number left, Number right)**
Returns true if left is less than right.


#### Boolean Validator.lessEqual(Number left, Number right)**
Returns true if left is less or equal than right.


#### Boolean Validator.greater(Number left, Number right)**
Returns true if left is greater than right.


#### Boolean Validator.greaterEqual(Number left, Number right)**
Returns true if left is greater or equal than right.


#### Boolean Validator.length(String str, String comparator, Number len)**
Check the length with comparator. Comparators are can be one of these:
* "<"
* ">"
* "<="
* "="
* "="

```
var validator = require('xvalid');
console.log(validator.length("sample text", "=", 11));
```