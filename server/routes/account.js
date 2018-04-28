const router = require('express').Router();
const jwt = require('jsonwebtoken');
const config = require('../config')

const User = require('../models/user');
const checkJWT = require('../middlewares/check-jwt');

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

router.post('/login', (req, res, next) => {
    console.log("Reached Login Post method");
    User.findOne({ email: req.body.email }, (err, user) => {
        if(err) throw err;

        if(!user) {
            console.log('User Doesnt exists');
            res.json({
                success: false,
                message: 'Authentication Failed! User not found'
            });
        } else if (user){
            var validPassword = user.comparePassword(req.body.password);
            if(!validPassword) {
                res.json({
                    success: false,
                    message: 'Account Failed, Wrong Password'
                });
            }else {
                var token = jwt.sign({
                    user: user
                }, config.secretKey, {
                    expiresIn: '7d'
                });
                res.json({
                    success: true,
                    message: 'Login Successful! Enjoy your Token',
                    token: token
                });
            }
        } 
    });
});

router.route('/profile')
    .get(checkJWT, (req, res, next) => {
        User.findOne({ _id: req.decoded.user._id }, (err, user) => {
            res.json({
                success: true,
                user: user,
                message: "Successful"
            });
        });
    })
    .post();

module.exports = router;