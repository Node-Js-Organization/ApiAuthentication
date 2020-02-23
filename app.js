//require env
require('dotenv').config();

//import packages
const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  cors = require('cors');

//import routes
const userRoutes = require('./routes/users');

//initialize express
const app = express();

//Middlewares
app.use(cors());
app.use(morgan('dev'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//Routes
app.use('/users', userRoutes);

//start the server
app.listen(process.env.PORT, () =>
  console.log(`Server started on port ${process.env.PORT}`)
);
