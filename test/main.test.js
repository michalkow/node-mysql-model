var mysqlModel = require('../mysql-model.js');

var MyAppModel = mysqlModel.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  database : 'mysql-model-test',
});


var Movie = MyAppModel.extend({
	tableName: "movies",
});

movie = new Movie();

Director = new MyAppModel({tableName: "directors"});

movie = new Movie({
	name: 'Serenity',
	director: 'Joss Whedon',
	language: 'English',
	year: 2005
});
// Will create new record
movie.save();

test('Made connnection', () => {
  expect(MyAppModel).toBeTruthy();
});

test('Saving data', done => {
  function callback(err, result, connection) {
    expect(err).toBeFalsy();
    done();
  }

  movie.save(callback);
});

test('Find Movie', done => {
	movie.find('first', {where: "name=Serenity"}, function(err, row) {
		expect(err).toBeFalsy();
		expect(row).objectContaining({
			name: 'Serenity',
			director: 'Joss Whedon',
			language: 'English',
			year: 2005
		});
		done();
	});
});
