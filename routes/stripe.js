const express = require("express");
const Order = require("../models/order");
const router = express.Router();
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE);
const nodemailer = require("nodemailer");
const { format } = require("date-fns");
const bookingModel = require("../models/Booking");
const userModel = require("../models/user");
const { differenceInDays } = require("date-fns");
const postmark = require("postmark");

let pointOption;
router.post("/create-checkout-session", async (req, res) => {
  const { booking, option } = req.body;
  const { place, ...usefulInfo } = booking;
  let discountPercentage = 0;
  let badgeType = "";

  if (option == "direct") {
    pointOption = "direct";
    const badgeVerify = await userModel.findOne({ _id: booking.user });
    if (!badgeVerify) {
      return res
        .status(401)
        .json("There seems to be an error verifying user's badge!");
    }
    badgeType = badgeVerify.badge;

    // Calculate the discount percentage based on the user's badge.
    if (badgeType === "Silver") {
      discountPercentage = 0.02; // 2% discount for Silver badge.
    } else if (badgeType === "Gold") {
      discountPercentage = 0.04; // 4% discount for Gold badge.
    } else if (badgeType === "Platinum") {
      discountPercentage = 0.06; // 6% discount for Platinum badge.
    }
  }
  if (option == "point") {
    pointOption = "point";
    const checkInDate = new Date(booking.checkIn);
    const checkOutDate = new Date(booking.checkOut);
    // Calculate the difference in days
    const differenceDays = differenceInDays(checkOutDate, checkInDate);
    if (differenceDays == 1) {
      discountPercentage = 0.1;
    } else {
      return res.status(409).json("Booking doesn't meet point requirements!");
    }
  }

  // Calculate the discounted price based on the discount percentage
  const discountedPrice = booking.price - booking.price * discountPercentage;
  const customer = await stripe.customers.create({
    metadata: {
      userId: booking.user,
      bookingId: booking._id,
      badge: badgeType,
      bookingPlace: booking.place.title,
      orderPhoto: booking.place.photos[0],
      bookingAddress: booking.place.address,
      booking: JSON.stringify(usefulInfo),
    },
  });
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: booking.place.title,
            images: [`${booking.place.photos[0]}`],
            description: `---------You have a ${
              discountPercentage * 100
            }% discount on this reservation!.---------${
              booking.place.extraInfo
            }`,
            metadata: {
              id: booking._id,
              discountedPrice: discountedPrice,
            },
          },
          unit_amount: parseInt(discountedPrice) * 100,
        },
        quantity: 1,
      },
    ],
    customer: customer.id,
    mode: "payment",
    success_url: `https://www.airbnb.felixdev.com.ng/checkout-success/${booking._id}`,
    cancel_url: "https://www.airbnb.felixdev.com.ng/account/bookings",
  });

  res.send({ url: session.url });
});

//   Send Order Email to the user/customer
const OrderEmail = async (customer, data) => {
  const details = JSON.parse(customer.metadata.booking);
  const html = `
  <div style="width: 80%; margin: 0 auto;box-shadow: 0 7px 30px -10px rgba(150, 170, 180, 0.5);text-align:center;">
  <img src="https://res.cloudinary.com/dljgkzwfz/image/upload/v1693831482/userImages/airbnb_lssgog.png" alt="headerImg" style="display: block; object-fit: contain" width="100%" height="100px" />
  <div class='myImage' style="margin:1.5rem auto;width="50%;text-align:center;">
    <img src="https://res.cloudinary.com/dljgkzwfz/image/upload/v1693836967/emailCheck_haidv8.jpg" alt="headerImg" width="70px" height="70px" />
  </div>
  <h1 style="padding-top: 8px; padding-bottom: 8px; border-bottom-width: 2px; text-align: center; font-size: 1.5rem; border-color: #48bb78;">Reservation Details</h1>
  <div style="background-color: #48bb78; color: #ffffff; font-weight: 600; text-align: center; padding: 1rem;">
    Status: <span>${data.status}</span>
  </div>
  <h1 style="border-radius:15px;background-color:rgba(128,0,0,0.5);font-size: 1.25rem; padding-bottom: 0.5rem; color: #fff;">Customer:</h1>
  <table style="width: 100%; color: #666; border-bottom: 2px solid #ddd; padding-bottom: 0.5rem;">
    <tr>
      <td>Full-Name:</td>
      <td>${details.fullName}</td>
    </tr>
    <tr>
      <td>Country:</td>
      <td>${data.customer_details.address.country}</td>
    </tr>
    <tr>
      <td>Phone-Number:</td>
      <td>${details.mobile}</td>
    </tr>
    <tr>
      <td>Email:</td>
      <td>${data.customer_details.email}</td>
    </tr>
  </table>

  <h1 style="border-radius:15px;background-color:rgba(128,0,0,0.5);font-size: 1.25rem; padding-bottom: 0.5rem; padding-top: 0.5rem; color: #fff;">Payments:</h1>
  <table style="width: 100%; color: #666; border-bottom: 2px solid #ddd; padding-bottom: 0.5rem;">
    <tr>
      <td>Payment-Intent:</td>
      <td>${data.payment_intent}</td>
    </tr>
    <tr>
      <td>Payment-Status:</td>
      <td>${data.payment_status}</td>
    </tr>
    <tr>
      <td>Amount Paid:</td>
      <td>$${details.price}</td>
    </tr>
    <tr>
      <td>Payment-Time:</td>
      <td>${format(
        new Date(data.created * 1000),
        "dd MMMM, yyyy HH:mm:ss a"
      )}</td>
    </tr>
  </table>

  <h1 style="border-radius:15px;background-color:rgba(128,0,0,0.5);font-size: 1.25rem; padding-bottom: 0.5rem; padding-top: 0.5rem; color: #fff;">Bookings:</h1>
  <table style="width: 100%; color: #666;">
    <tr>
      <td>Booking Number:</td>
      <td>${data.customer}</td>
    </tr>
    <tr>
      <td>Booking Location:</td>
      <td>${customer.metadata.bookingPlace}</td>
    </tr>
    <tr>
      <td>Booking Address:</td>
      <td>${customer.metadata.bookingAddress}</td>
    </tr>
    <tr>
      <td>Guests:</td>
      <td>${details.numOfGuests}</td>
    </tr>
    <tr>
      <td>Check-In Time:</td>
      <td>${format(new Date(details.checkIn), "dd EEEE MMMM, yyyy")}</td>
    </tr>
    <tr>
      <td>Check-Out Time:</td>
      <td>${format(new Date(details.checkOut), "dd EEEE MMMM, yyyy")}</td>
    </tr>
  </table>
</div>

`;
  return new Promise(async (resolve, reject) => {
    try {
      const serverToken = process.env.POSTMARK;
      const client = new postmark.ServerClient(serverToken);

      const result = client.sendEmail({
        From: "justfelix@felixdev.com.ng",
        To: data.customer_details.email,
        Subject: "Reservation Succesfully Confirmed!",
        HtmlBody: html,
      });
      resolve("Email sent successfully", result);
    } catch (error) {
      console.error("Error sending email:", error);
      reject("Email sending failed");
    }
  });
};

const updatePoint = async (customer) => {
  if (pointOption == "point") {
    const deductedPoint = 50;
    const user = await userModel.findOne({ _id: customer.metadata.userId });
    user.rewardPoint -= deductedPoint;
    const updatedUser = await user.save();
  } else {
    return;
  }
};

// Update Payment Status
const updatePaymentStatus = async (customer) => {
  try {
    await bookingModel.updateOne(
      { _id: customer.metadata.bookingId },
      { $set: { status: "Paid" } }
    );
    console.log("Payment Successful!");
  } catch (err) {
    console.log(err.message);
  }
};

//   Create order using the Order Model
const createOrder = async (customer, data) => {
  const details = JSON.parse(customer.metadata.booking);

  const newOrder = new Order({
    userId: customer.metadata.userId,
    bookingId: customer.metadata.bookingId,
    orderPhoto: customer.metadata.orderPhoto,
    bookingPlace: customer.metadata.bookingPlace,
    bookingAddress: customer.metadata.bookingAddress,
    customerId: data.customer,
    paymentIntentId: data.payment_intent,
    paymentTime: data.created,
    details: details,
    email: data.customer_details.email,
    country: data.customer_details.address.country,
    status: data.status,
    payment_status: data.payment_status,
  });

  // Reward/Point Logic
  try {
    if (pointOption == "direct") {
      let rewardPoints;
      if (details.price >= 20 && details.price <= 200) {
        rewardPoints = 5;
      } else if (details.price >= 201 && details.price <= 500) {
        rewardPoints = 10;
      } else if (details.price >= 501 && details.price <= 1000) {
        rewardPoints = 15;
      }
      const rewardUser = await userModel.findOne({
        _id: customer.metadata.userId,
      });
      if (!rewardUser) {
        return res.status(401).json("User not Found!");
      }
      rewardUser.rewardPoint += rewardPoints;
      const updateUser = await rewardUser.save();
      const updatedUser = await userModel.findOne({
        _id: customer.metadata.userId,
      });
      if (updatedUser.rewardPoint >= 500 && updatedUser.rewardPoint <= 999) {
        updatedUser.badge = "Silver";
      } else if (
        updatedUser.rewardPoint >= 1000 &&
        updatedUser.rewardPoint <= 1499
      ) {
        updatedUser.badge = "Gold";
      } else if (
        updatedUser.rewardPoint >= 1500 &&
        updatedUser.rewardPoint <= 1999
      ) {
        updatedUser.badge = "Platinum";
      }
      const refreshedUser = await updatedUser.save();
    }
    const savedUser = await newOrder.save();
  } catch (err) {
    console.log(err);
  }
};

// server.js
//
// Use this sample code to handle webhook events in your integration.
let endpointSecret;
// endpointSecret = ;

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];

    let data;
    let eventType;

    if (endpointSecret) {
      let event;
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        console.log("Webhook Verified!");
      } catch (err) {
        console.log(`Webhook Error: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }
      data = event.data.object;
      eventType = event.type;
    } else {
      data = req.body.data.object;
      eventType = req.body.type;
    }

    // Handle the event
    if (eventType === "checkout.session.completed") {
      stripe.customers
        .retrieve(data.customer)
        .then(async (customer) => {
          await createOrder(customer, data);
          updatePaymentStatus(customer);
          updatePoint(customer);
          await OrderEmail(customer, data);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }

    // Return a 200 res to acknowledge receipt of the event
    res.send().end();
  }
);

module.exports = router;
