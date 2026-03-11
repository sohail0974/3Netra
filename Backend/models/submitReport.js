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
        required : false
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
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // Matches your user model name
        required: true // If you only want logged-in users to submit
    }
},{timestamps : true});

module.exports = mongoose.model('submitReport',reportsSchema);