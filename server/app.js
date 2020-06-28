const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const express = require('express');

const routes = require('./routes')
const models = require('./models');
const redisStore = require('./config/redis')(session);

require('dotenv').config();
require('./config/passport')(passport);

const app = express();

const sess = session({
	resave: false,
	saveUninitialized: false,
	secret: process.env.SESS_KEY,
	store: redisStore,
	cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 }
});

const corsOptions = {
	origin: 'http://localhost:3000',
	optionsSuccessStatus: 200,
	credentials: true // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(sess);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', routes)(passport);
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