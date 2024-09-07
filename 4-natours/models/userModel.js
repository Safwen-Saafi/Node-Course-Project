const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name:{
        type : String,
        required :[true, 'Please provide a name'],
    },
    email : {
        type : String,
        required : [true, 'Please provide an email'],
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email !'],
        unique : true

    },
    photo : {
        type : String,
        default : "defaultUser.png",
    },
    password:{
        type : String,
        required: [true,'Please provide a password!'],
        minlength: 8,
        select: false 
    },
    passwordConfirm :{
        type : String,
        required:[true, 'Please Confirm your password'],
        validate: {
          // This only works on CREATE and SAVE!!!
          validator: function(el) {
            return el === this.password;
          },
          message: 'Passwords are not the same!'
        }
    },
    passwordChangedAt: Date
});


// Middleware to hash password before saving it
userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12, increasing cost affects performance but enhances encryption
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// Middleware to compare paswords in login, it's an instance method available in all documents
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    // change the changeddate format to ms
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};


const User = mongoose.model('User', userSchema);

module.exports = User;

