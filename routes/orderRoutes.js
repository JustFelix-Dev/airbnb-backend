const express = require('express');
const { getBookedOrder, deleteOrder, getUserOrder } = require('../controllers/orderController');
const router = express.Router()

router.get('/getOrder/:id',getBookedOrder)
router.delete('/deleteOrder/:id',deleteOrder)
router.get('/getUserOrder/:id',getUserOrder)

module.exports = router