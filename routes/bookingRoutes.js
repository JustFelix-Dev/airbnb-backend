const express = require('express');
const { makeBooking, getBooking, deleteBooking } = require('../controllers/bookingController');
const app  = express();
const router = express.Router()

router.post('/bookings',makeBooking)
router.get('/bookings',getBooking)
router.delete('/deleteBooking/:id',deleteBooking)

module.exports =  router;