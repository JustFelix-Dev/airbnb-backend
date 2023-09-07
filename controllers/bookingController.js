const bookingModel = require("../models/Booking");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const Order = require("../models/order");

const makeBooking = (req, res) => {
  const { token } = req.cookies;
  const { place, checkIn, checkOut, numOfGuests, fullName, mobile, price } =
    req.body;
  jwt.verify(token, process.env.SECRET, {}, (err, user) => {
    if (err) throw err;
    const bookingDoc = bookingModel
      .create({
        place,
        checkIn,
        checkOut,
        numOfGuests,
        fullName,
        mobile,
        price,
        user: user.id,
      })
      .then((doc) => {
        res.status(201).json(doc);
      })
      .catch((err) => {
        console.log({ error: err.message });
      });
  });
};

const getBooking = async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, process.env.SECRET, {}, async (err, user) => {
    if (err) throw err;
    const { id } = user;
    const bookings = await bookingModel.find({ user: id }).populate("place");
    res.json(bookings);
  });
};

const deleteBooking = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedItem = await bookingModel.findOneAndDelete({ _id: id });
    if (!deletedItem) {
      return res.status(401).json("Booking Not Found!");
    }
    res.status(201).json("Booking successfully deleted!");
  } catch (err) {
    return res.status(503).json("Server Error!");
  }
};

module.exports = { makeBooking, getBooking, deleteBooking };
