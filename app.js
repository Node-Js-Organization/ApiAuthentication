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
const port = 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));