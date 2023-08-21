const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    owner:
        {type:mongoose.Schema.Types.ObjectId, ref:'User'},
    title: {
        type: String,
    },
    address:{
        type: String,
    },
    photos:{
        type:[String],
    },
    description:{
        type:String,
    },
    perks:{
        type:[String],
    },
    checkIn:{
        type:String,
    },
    checkOut:{
        type:String,
    },
    guests:{
        type:Number,
    },
    extraInfo:{
        type:String,
    },
    price:{
        type:Number,
    }
})

const Locationmodel = mongoose.model('location', locationSchema);

module.exports = Locationmodel;
