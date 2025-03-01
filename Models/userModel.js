const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
     userName : {
        type : String ,
        required : true
   },
   phone : {
        type : Number ,
        required : true
   },
   address : {
        type : String ,
        required : true
   },
   password : {
     type : String ,
     required : true
   }
})

const user = mongoose.model('User', userSchema);

module.exports = user;