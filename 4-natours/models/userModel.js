const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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
    role: {
      type: String,
      enum: ['user', 'guide', 'lead-guide', 'admin'],
      default: 'user'
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
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false
    }
});


// !Middleware to hash password before saving it
userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12, increasing cost affects performance but enhances encryption
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field, we used it for checking so we don't keep it
  this.passwordConfirm = undefined;
  next();
});


// !Hide all of the deleted accounts, actually they are hided from the user not deleted
userSchema.pre(/^find/, function(next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});


// !Modify the changePasswordAt
userSchema.pre('save', function(next) {
  // this.new don't apply to a new document
  if (!this.isModified('password') || this.isNew) return next();
  // To ensure that the token is always created after the password has been changed
  this.passwordChangedAt = Date.now() - 1000;
  next();
});



// !Middleware to compare paswords in login, it's an instance method available in all documents
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};


// !Returns true if the password has been changed after the issue of the JWT token
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




userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10 minutes
  console.log(this.passwordResetExpires);
  return resetToken;
};



const User = mongoose.model('User', userSchema);

module.exports = User;

