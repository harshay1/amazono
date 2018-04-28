const router = require('express').Router();
const jwt = require('jsonwebtoken');
const config = require('../config')

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
    console.log("Reached Signup Post method");

    let user = new User();
    user.name = req.body.firstname;
    user.email = req.body.email;
    user.password = req.body.password;
    user.picture = user.gravatar();
    user.isSeller = req.body.isSeller;

    console.log(req.body.email);
    User.findOne({email: req.body.email}, (err, existingUser) => {
        if(existingUser)
            {
                console.log('User already exists');
                res.json({
                    success: false,
                    message: 'Account with that email already exists! Please try a new email'
                });
            }        
            else {
                user.save();
                
                var token = jwt.sign({
                    user: user
                }, config.secretKey, {
                    expiresIn: '7d'
                });
                
                res.json({
                    success: true,
                    message: 'Account Successfully Created Enjoy Your Token',
                    token: token
                });
            }
    });
});

module.exports = router;