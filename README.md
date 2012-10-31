node-mysql-model
========
A backbone based model for communicating with a MySQL database using [felixge/node-mysql](https://github.com/felixge/node-mysql).

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


Retrieves records from database

```javascript
yourModel.find();
yourModel.find(method);
yourModel.find(callback);
yourModel.find(method, conditions);
yourModel.find(method, callback);
yourModel.find(method, conditions, callback);
```		

- *string* **method**: uses one of find methods
- *object* **conditions**: set find conditions
- *function* **callback**: returns errors and results

```javascript
movie.find('all', {where: "year > 2001"}, function(err, rows, fields) {
	// Do something...
});
```		

> save

Saves your model to database

```javascript
yourModel.save();
yourModel.save(where);
yourModel.save(callback);
yourModel.save(where, callback);
```	

- *string* **where**: set condition for WHERE
- *function* **callback**: returns errors and results

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

Deletes your model from database and unsets it

```javascript
yourModel.remove();
yourModel.remove(where);
yourModel.remove(callback);
yourModel.remove(where, callback);
```	

- *string* **where**: set condition for WHERE
- *function* **callback**: returns errors and results

```javascript
// Will delete record from database matching id model
movie.set('id', 8);
movie.remove();
// Will delete records from database matching where condition
movie.remove('year < 1980');
```	

> read

Retrieves record from database and set it to current model

```javascript
yourModel.read();
yourModel.read(id);
yourModel.read(callback);
yourModel.read(id, callback);
```	

- *integer* **id**: Id of record to read
- *function* **callback**: returns errors and results

```javascript
movie.set('id', 6);
movie.read();
// or
movie.read(6);
```	

> query

Retrieves record from database and set it to current model

```javascript
yourModel.query(query);
yourModel.query(query, callback);
```	

- *string* **query**: Your custom sql query to run 
- *function* **callback**: returns errors and results

```javascript
movie.query("SELECT name FROM movies WHERE director = 'James Cameron' ORDER BY year", function(err, rows, fields) {
	// Do something...
});
```	

> setSQL

Method to replace 'set', when setting results passed back by node-mysql

```javascript
yourModel.setSQL(result);
```	

- *object* **result**: Results passed back by find or read

```javascript
movie.find('first', {where: "id=12"}, function(err, row) {
	movie.setSQL(row);
});
```	

**'find' methods**

> 'all'

Returns all the records matching conditions

Returns:

- array

```javascript
movie.find('all', {where: "language = 'German'", limit: [0, 30]}, function(err, rows) {
	for(var i; i<rows.length; i++) {
		console.log(rows[i]);
	}
});
```	

> 'count'

Returns number of records matching conditions

Returns:

- integer

```javascript
movie.find('count', {where: "year = 2012"}, function(err, result) {
		console.log(result);
});
```	

> 'first'

Returns first the records matching conditions

Returns:

- object

```javascript
movie.find('first', {where: "id = 3"}, function(err, row) {
		console.log(row);
});
```	
 
> 'field'

Returns field of the first record matching conditions

Returns:

- depends on field type

```javascript
movie.find('field', {fields: ['name'], where: "id = 3"}, function(err, field) {
		console.log(field);
});
```	

**'find' conditions**

> fields

Fields to select from the table

> where

Condition for WHERE

> group

Condition for GROUP BY

> groupDESC

If true, sets DESC order for GROUP BY

> having

Condition for HAVING

> order

Condition for ORDER BY

> orderDESC

If true, sets DESC order for ORDER BY

> limit

Condition for LIMIT
				
License
-------
node-mysql-model is released under [MIT license](http://opensource.org/licenses/mit-license.php).

Credits
-------
node-mysql-model was created by [Michał Kowalkowski](https://github.com/michalkow). You can contact me at [kowalkowski.michal@gmail.com](mailto:kowalkowski.michal@gmail.com)
