const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId:{
        type: String,
    },
    paymentIntentId:{
        type: String,
        required: true
    },
    bookingId:{
        type:String,
        required: true
    },
    bookingPlace:{
        type: String,
        required: true,
    },
    orderPhoto:{
         type: String,
         required: true,
    },
    bookingAddress:{
        type: String,
        required: true,
    },
    details:[{
        numOfGuests:{
            type: Number,
        },
        checkIn:{
            type:String,
        },
        checkOut:{
            type: String,
        },
        fullName:{
            type: String,
        },
        mobile:{
            type: String,
        },
        price:{
            type: Number,
            required: true
        },
    }
    ],
    email:{
        type: String,
    },
    payment_status:{
        type: String,
        required: true,
    },
    paymentTime:{
        type: Number,
    },
    customerId:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        required: true,
    },
    country:{
        type: String,
        required: true,
    }

},{timestamps: true});

const Order = mongoose.model('order',orderSchema);

module.exports = Order;