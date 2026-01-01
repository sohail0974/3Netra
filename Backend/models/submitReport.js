const mongoose = require('mongoose');

const schema = mongoose.Schema;

const reportsSchema = new schema({
    location:{
        lat : {type : Number,required : true},
        lng : {type : Number,required : true}
    },
    description:{
        type : String,
        required : true
    },
    address:{
        type : String,
        reruied : false
    },
    dateandtime:{
        type : String,
        required : true
    },
    evidence:{
        type : String,
        required : false
    },
    status:{
        type : String,
        enum : ['pending','resolved','dismissed'],
        default : 'pending'
    }
},{timestamps : true});

module.exports = mongoose.model('submitReport',reportsSchema);