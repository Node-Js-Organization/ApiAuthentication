//require env
require('dotenv').config();

//import packages
const express = require('express'),
      morgan = require('morgan'),
      bodyParser = require('body-parser');

//import routes
const userRoutes = require('./routes/users');

//initialize express
const app = express();

//Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));

//Routes
app.use('/users', userRoutes);

//start the server
app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`));