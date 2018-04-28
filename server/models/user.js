var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var Schema = mongoose.Schema;

/* User Schema attributes / characteristics or fields */

var UserSchema = new Schema({

    email: {type: String, unique: true, lowercase: true},
    name: String,
    password: String,
    picture: String,
    isSeller: {type: Boolean, default: false},
  
    address: {
      addr1: String,
      addr2: String,
      city: String,
      state: String,
      country: String,
      postalCode: String
    },
  
    created: {type: Date, default: Date.now},
});


/* Hash the password before we even save it to the database */

UserSchema.pre('save', function(next){
  var user = this;
  if(!user.isModified('password')) return next();
  //below 10 means it generates 10 random data 1234578hj
  bcrypt.genSalt(10, function(err, salt){
    if(err) return next(err);
    bcrypt.hash(user.password, salt, null, function(err, hash){
      if(err) return next(err);
      //the hash here is the random unique string which genereated
      user.password = hash;
      next();
    });
  });
});

/* Compare password in the database with the one typed by User */

UserSchema.methods.comparePassword = function(password){
  return bcrypt.compareSync(password, this.password);
}
UserSchema.methods.gravatar = function(size) {
    if(!this.size)
        size = 200;
    if(!this.email) {
        return 'https://gravatar.com/avatar/?s'+ size +'&d=retro';
    }else {
        var md5 = crypto.createHash('md5').update(this.email).digest('hex');
        return 'https://gravatar.com/avatar/'+md5+'?s='+size+'&d=retro'
    }
}

//below line is used to export the entire above schema to the server.js file
module.exports = mongoose.model('user', UserSchema);
