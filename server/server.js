const express = require('express');
const morgan = require('morgan'); 
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');
const cors = require('cors');
const userRoutes = require('./routes/account');

const app = express();

/* Middleware */
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false }));
//used to have seamless connectivity between Server from Clients
app.use(cors());
app.use('/api/accounts', userRoutes);

/* Database Connectivity */
mongoose.connect(config.database, (err) => {
    if(err)
        {
            console.log(err);
        }
    else
        console.log('We are now connected to the database');
});

/*This is where our app is listening*/
app.listen(config.port, function(err) {
    if(err)
        throw err;
    else
        console.log('Magic Happens on port'+ config.port);
});
