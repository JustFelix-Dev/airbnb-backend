const bookingModel = require("../models/Booking");
const Order = require("../models/order");

const getBookedOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findOne({ bookingId: id });
    if (!order || !order._id) {
      return res.status(402).json("Order not found.Something went wrong!.");
    }
    res.status(200).json(order);
  } catch (err) {
    console.log(err.message);
  }
};

const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedItem = await Order.findOneAndDelete({ bookingId: id });
    const updatedItem = await bookingModel.findOneAndUpdate(
      { _id: id },
      { $set: { status: "Not Paid" } }
    );
    if (!deletedItem) {
      return res.status(401).json("Reservation Not Found!");
    }
    if (!updatedItem) {
      return res.status(401).json("Booking Not Found!");
    }
    res.status(201).json("Reservation successfully cancelled!");
  } catch (err) {
    return res.status(503).json("Server Error!");
  }
};

const getUserOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const userOrder = await Order.find({ userId: id });
    if (!userOrder) {
      return res.status(401).json("No reservation has been booked!");
    }
    res.status(201).json(userOrder);
  } catch (err) {
    res.status(500).json("Something went wrong!");
  }
};

module.exports = { getBookedOrder, deleteOrder, getUserOrder };
