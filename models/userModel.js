const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Code Objectives
// The User model should fully encapsulate the password encryption and verification logic
// The User model should ensure that the password is always encrypted before saving
// The User model should be resistant to program logic errors, like double-encrypting the password on user updates
// bcrypt interactions should be performed asynchronously to avoid blocking the event loop (bcrypt also exposes a synchronous API)

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    // usernames always required
    required: true,
    // username must be unique
    unique: true,
  },
  password: String,
});

// This plugins passport-local-mongoose to our schema and adds methods to our user Model
UserSchema.plugin(passportLocalMongoose);

// pre-save hook - callback next must be executed or server will hang
UserSchema.pre('save', function(next) {
  // saving the correct context of 'this', caching into a var
  const user = this;
  // if a user does'nt update their password, do not create a new password hash
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  // if the user has modified their password, let's hash it
  bcrypt.genSalt(saltRounds, function(err, salt) {
    if (err) return next(err);

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      // check if the there is an error
      if (err) return next(err);
      // set their password to newly hashed password, no longer plain text
      user.password = hash;
      // save the user in the db
      next();
    });
  });
});

// now let's write an instance method for all of our user documents which will be used to compare a plain text password with a hashed password in the database. Notice the second parameter to this function is a callback function called "next". Just like the code above, we need to run next() to move on.
UserSchema.methods.comparePassword = function(candidatePassword, next) {
  // when this method is called, compare the plain text password with the password in the database.
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if(err) return next(err);
    // isMatch is a boolean which we will pass to our next function
    next(null, isMatch);
  });
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
