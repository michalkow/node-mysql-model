var mysqlModel = require('../mysql-model.js');
var mysql = require('mysql');

var dbConfig = {
  host     : '127.0.0.1',
  user     : 'root',
  database : 'mysqlmodeltest',
};

var db = mysql.createConnection(dbConfig);
db.connect();

function cleanUpDatabase(db, cb) {
	db.query('DROP TABLE IF EXISTS movies;', function() {
		db.query('CREATE TABLE `movies` ( `name` VARCHAR(100) NOT NULL , `director` VARCHAR(100) NOT NULL , `language` VARCHAR(100) NOT NULL , `year` INT(11) NOT NULL , `id` INT(11) NOT NULL AUTO_INCREMENT , PRIMARY KEY (`id`)) ENGINE = MyISAM;', function() {
			cb();
		});
	});
}

beforeAll(done => {
  cleanUpDatabase(db, () => {
  	db.end();
  	done();
  });
});

var MyAppModel = mysqlModel.createConnection(dbConfig);
var Movie = MyAppModel.extend({
	tableName: "movies",
});

var movie = new Movie({
	name: 'Serenity',
	director: 'Joss Whedon',
	language: 'English',
	year: 2005
});

test('Made connnection', () => {
  expect(MyAppModel).toBeTruthy();
});

test('Made Model', () => {
  expect(movie).toBeTruthy();
});

test('Saving data', done => {
  movie.save(function (err, result, connection) {
    expect(err).toBeFalsy();
    done();
  });
});

test('Find Movie', done => {
	movie.find('first', {where: "name='Serenity'"}, function(err, row) {
		//expect(err).toBeFalsy();
		expect(row).toMatchObject({
			name: 'Serenity',
			director: 'Joss Whedon',
			language: 'English',
			year: 2005
		});
		done();
	});
});

test('Remove Movie', done => {
	movie.remove("name='Serenity'", function(err, row) {
		expect(err).toBeFalsy();
		done();
	});
});

test('Kill Connection', done => {
	movie.killConnection(function(err) {
		expect(err).toBeFalsy();
		done();
	});
});



