const mongoose = require('mongoose');
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name:{
        type : String,
        required :[true, 'Please provide a name'],
        unique : true
    },
    email : {
        type : String,
        required : [true, 'Please provide an email'],
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a correct email !'],
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
    },
    passwordConfirm :{
        type : String,
        required:[true, 'Please Confirm your password']
    }
});


const User = mongoose.model('User', userSchema);

module.exports = User;

