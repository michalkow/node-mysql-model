node-mysql-model
========
A [backbone](http://backbonejs.org) based model for communicating with a MySQL database using [felixge/node-mysql](https://github.com/felixge/node-mysql).

Install
--------

Install from npm package:

```bash
npm install mysql-model
```

Or install from git:

```bash
npm install git://github.com/michalkow/node-mysql-model.git
```

Usage
--------

Add the mysql-model module to your application :

```javascript
var mysqlModel = require('mysql-model');
```
  			
Then create a model that will be main one for your application (all others will extend it):

```javascript
var MyAppModel = mysqlModel.createConnection({
  host     : 'database-host',
  user     : 'database-user',
  password : 'database-password',
  database : 'database-name',
});

var Movie = MyAppModel.extend({
	tableName: "movies",
});

movie = new Movie();

// OR

movie = new MyAppModel({tableName: "movies"});
```		
	
To see complete list of options for creating a connection with the database visit [felixge/node-mysql](https://github.com/felixge/node-mysql#connection-options) readme. 	

API
--------
**Model Settable Options**

>tableName

Name of a MySQL table the model will refer to:

```javascript
var Movie = MyAppModel.extend({
	tableName: "movies",
});
```	

**Methods**

> find


*Retrieves records from database*

Usage:

```javascript
movie.find();
movie.find(method);
movie.find(callback);
movie.find(method, conditions);
movie.find(method, callback);
movie.find(method, conditions, callback);
```		
Parameters:

- *string* **method**: uses one of find methods
- *object* **conditions**: set find conditions
- *function* **callback**: returns errors and results

Example:

```javascript
movie.find('all', {where: "year > 2001"}, function(err, rows, fields) {
	// Do something...
});
```		

> save

*Saves your model to database*

Usage:

```javascript
movie.save();
movie.save(where);
movie.save(callback);
movie.save(where, callback);
```	
Parameters:

- *string* **where**: set condition for WHERE
- *function* **callback**: returns errors and results

Example:

```javascript
movie = new Movie({
	name: 'Serenity',
	director: 'Joss Whedon',
	language: 'English',
	year: 2005
});
// Will create new record
movie.save();
movie.set('id', 4);
// Will update record if id exists
movie.save();
```		

> remove

*Deletes your model from database and unsets it*

Usage:

```javascript
movie.remove();
movie.remove(where);
movie.remove(callback);
movie.remove(where, callback);
```	
Parameters:

- *string* **where**: set condition for WHERE
- *function* **callback**: returns errors and results

Example:

```javascript
// Will delete record from database matching id model
movie.set('id', 8);
movie.remove();
// Will delete records from database matching where condition
movie.remove('year < 1980');
```	

> read

*Retrieves record from database and set it to current model*

Usage:

```javascript
movie.read();
movie.read(id);
movie.read(callback);
movie.read(id, callback);
```	

Parameters:

- *integer* **id**: Id of record to read
- *function* **callback**: returns errors and results

Example:

```javascript
movie.set('id', 6);
movie.read();
// or
movie.read(6);
```	

> query

*Runs custom query*

Usage:

```javascript
movie.query(query);
movie.query(query, callback);
```	
Parameters:

- *string* **query**: Your custom sql query to run 
- *function* **callback**: returns errors and results

Example:

```javascript
movie.query("SELECT name FROM movies WHERE director = 'James Cameron' ORDER BY year", function(err, rows, fields) {
	// Do something...
});
```	

> setSQL

*Method to replace 'set', when setting results passed back by node-mysql*

Usage:

```javascript
movie.setSQL(result);
```	
Parameters:

- *object* **result**: Results passed back by find or read

Example:

```javascript
movie.find('first', {where: "id=12"}, function(err, row) {
	movie.setSQL(row);
});
```	

**'find' methods**

> 'all'

*Returns all the records matching conditions*

Returns:

- array

Example:

```javascript
movie.find('all', {where: "language = 'German'", limit: [0, 30]}, function(err, rows) {
	for(var i=0; i<rows.length; i++) {
		console.log(rows[i]);
	}
});
```	

> 'count'

*Returns number of records matching conditions*

Returns:

- integer

Example:

```javascript
movie.find('count', {where: "year = 2012"}, function(err, result) {
		console.log(result);
});
```	

> 'first'

*Returns first the records matching conditions*

Returns:

- object (hash)

Example:

```javascript
movie.find('first', {where: "id = 3"}, function(err, row) {
		console.log(row);
});
```	
 
> 'field'

*Returns field of the first record matching conditions*

Returns:

- depends on field type

Example:

```javascript
movie.find('field', {fields: ['name'], where: "id = 3"}, function(err, field) {
		console.log(field);
});
```	

**'find' conditions**

> fields

*Fields to select from the table*

Accepts:

- array
- string

Example:

```javascript
movie.find('all', {fields: ['id', 'name', 'year']});
// SELECT id, name, year FROM movies
movie.find('all', {fields: "name"});
// SELECT name FROM movies
```	

> where

*Operators for MySQL WHERE clause.*

Accepts:

- string

Example:

```javascript
movie.find('all', {where: "year > 1987"});
// SELECT * FROM movies WHERE year > 1987
```	

> group

*Operators for MySQL GROUP BY clause.*

Accepts:

- array
- string

Example:

```javascript
movie.find('all', {group: ['year', 'name']});
// SELECT * FROM movies GROUP BY year, name
movie.find('all', {group: "name"});
// SELECT * FROM movies GROUP BY name
```	

> groupDESC

*If true, sets descending order for GROUP BY*

Accepts:

- boolean

Example:

```javascript
movie.find('all', {group: ['year', 'name'], groupDESC:true});
// SELECT * FROM movies GROUP BY year, name DESC
```	

> having

*Operators for MySQL HAVING clause.*

Accepts:

- string

Example:

```javascript
movie.find('all', {fields: ['name', 'COUNT(name)'], group: "name", having: "COUNT(name) = 1"});
// SELECT name, COUNT(name) FROM movies GROUP BY name HAVING COUNT(name) = 1
```

> order

*Operators for MySQL ORDER BY clause.*

Accepts:

- array
- string

Example:

```javascript
movie.find('all', {group: ['year', 'name']});
// SELECT * FROM movies ORDER BY year, name
movie.find('all', {group: "name"});
// SELECT * FROM movies ORDER BY name
```	

> orderDESC

*If true, sets descending order for ORDER BY*

Accepts:

- boolean

Example:

```javascript
movie.find('all', {group: ['year', 'name'], orderDESC:true});
// SELECT * FROM movies ORDER BY year, name DESC
```	

> limit

*Operators for MySQL LIMIT clause.*

Accepts:

- array
- string

Example:

```javascript
movie.find('all', {limit: [0, 30]});
// SELECT * FROM movies LIMIT 0, 30
movie.find('all', {limit: "10, 40"});
// SELECT * FROM movies LIMIT 10, 40
```	

Todo
-------
- validation
- relations
				
License
-------
node-mysql-model is released under [MIT license](http://opensource.org/licenses/mit-license.php).

Credits
-------
node-mysql-model was created by [Michał Kowalkowski](https://github.com/michalkow). You can contact me at [kowalkowski.michal@gmail.com](mailto:kowalkowski.michal@gmail.com)
