const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config({path: path.join(__dirname,'../.env')});
let db = {};

const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASS,
	{
		host: process.env.DB_HOST,
		dialect: 'mysql',
		logging: false,
		pool: {
			max: 5,
			min: 1,
			acquire: 30000,
			idle: 10000
		},
		define: {
			underscored: false,
			charset: 'utf8',
			timestamps: true
		}
	}
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.course = require('./course.js')(sequelize, Sequelize);
db.subject = require('./subject.js')(sequelize, Sequelize);
db.topic = require('./topic.js')(sequelize, Sequelize);
db.user = require('./user.js')(sequelize, Sequelize);

Object.keys(db).forEach(modelName => {
	if(db[modelName].associate) db[modelName].associate(db);
});

module.exports = db;