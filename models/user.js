// const mongoose= require('mongoose');
// const Schema=mongoose.Schema;
// const passportLocalMongoose= require('passport-local-mongoose');

// //User Model
// //'passport-local-mongoose' By Default Add Username With Salt And Hash Value.
// const userSchema = new Schema({
//     email:{
//         type:String,
//         required:true
//     }
// });

// userSchema.plugin(passportLocalMongoose);

// module.exports=mongoose.model("User",userSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// User Model
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,  // Ensure email is unique
    }
});

// Configure passport-local-mongoose to use email as username
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);