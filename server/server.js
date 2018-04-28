const express = require('express');
const morgan = require('morgan'); 
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

/* Middleware */
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false }));

/**/
app.listen(3030, function(err) {
    if(err)
        throw err;
    else
        console.log('Magic Happens on port 3030');
});

/* HTTP method calls*/
app.get('/', (req, res, next) => {
    res.json({
        user: "Harsha Yalavarthy"
    });
});