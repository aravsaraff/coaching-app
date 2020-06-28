const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const express = require('express');
const routes = require('./routes')
const cors = require('cors');
const models = require('./models');
require('dotenv').config();

const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const corsOptions = {
	origin: 'http://localhost:3000',
	optionsSuccessStatus: 200,
	credentials: true // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

app.use('/', routes);
const port = process.env.PORT || 8888;

models.sequelize.sync().then(
	()=>{
		app.listen(port,err=>{
			console.log(err || `Listening on ${port}`);
		});
	},
	err => {
		console.log('DB Connection failed');
		console.log(err);
	}
);