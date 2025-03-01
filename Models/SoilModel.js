const mongoose = require('mongoose');
const soilSchema = mongoose.Schema({
   Type : {
        type : String ,
        required : true,
        unique : true,
   },
   waterRequired : {
     type : Number ,
     required : true
   }
})

const soilType = mongoose.model('soilType', soilSchema);

module.exports = soilType;