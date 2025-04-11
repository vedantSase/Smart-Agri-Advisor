const mongoose = require('mongoose');
const cropSchema = mongoose.Schema({
   soil : {
        type : String ,
        required : true,
        unique : true,
   },
   temperature : {
     type : Number ,
     required : true
   },
   humidity : {
     type : Number ,
     required : true
   },
   rainfall : {
     type : Number ,
     required : true
   }
})

const cropData = mongoose.model('crop', cropSchema);

module.exports = cropData;