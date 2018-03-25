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
  	done();
  });
});

function testEnvironment(callback) {
	var connection = mysql.createConnection(dbConfig);
	connection.connect(function () {
		var Movie = mysqlModel.Model.extend({
			connection: connection,
			tableName: "movies",
		});
		var Movies = mysqlModel.Collection.extend({
			model: Movie,
			connection: connection,
			tableName: "movies",
		});

		var movies = new Movies();
		var movie = new Movie({
			name: 'Serenity',
			director: 'Joss Whedon',
			language: 'English',
			year: 2005
		});

		callback(connection, movies, movie);
	});
} 

test('Featch data no id', done => {
	testEnvironment((connection, movies, movie) => {
		movie.fetch().catch(function(err) {
			expect(err).toBeTruthy();
			done();
		});
	});
});

test('Saving data', done => {
	testEnvironment((connection, movies, movie) => {
		movie.save().then((results) => {
			expect({ json: movie.toJSON(), id: movie.id}).toMatchObject({
				json: {
					name: 'Serenity',
					director: 'Joss Whedon',
					language: 'English',
					year: 2005
				},
				id: 1
			});
			done();
		});
	});
});

test('Featch data', done => {
	testEnvironment((connection, movies, movie) => {
		movie.fetch(1).then(() => {
			expect({ json: movie.toJSON(), id: movie.id }).toMatchObject({
				json: {
					name: 'Serenity',
					director: 'Joss Whedon',
					language: 'English',
					year: 2005
				},
				id: 1
			});
			done();
		});
	});
});

test('Remove Movie', done => {
	testEnvironment((connection, movies, movie) => {
		movie.save().then(() => {
			movie.destroy().then(() =>{
				expect(movie.toJSON()).toMatchObject({});
				done();
			});
		});
	});
});

test('Movies Collection', done => {
	testEnvironment((connection, movies, movie) => {
		movies.create({
			name: 'Serenity',
			director: 'Joss Whedon',
			language: 'English',
			year: 2005
		}).then(() => {
			movies.sync().then(() => {
				expect(movies.toJSON()[0]).toMatchObject(
					{
						id: 3,
						name: 'Serenity',
						director: 'Joss Whedon',
						language: 'English',
						year: 2005
					}
				);
				done();
			});
		});
	});
});



