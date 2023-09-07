const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const router = require("express").Router();
const passport = require("passport");
require("https").globalAgent.options.rejectUnauthorized = false;

app.use(cookieParser());

const CLIENT_URI = "https://www.airbnb.felixdev.com.ng/";

router.get("/login/success", (req, res) => {
  const token = req.cookies.token;
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successful",
      user: req.user,
      token: token,
    });
  }
});
router.get("/login/failed", (req, res) => {
  res.status(401).json({ success: false, message: "failure" });
});

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect(CLIENT_URI);
});

// Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: CLIENT_URI,
    failureRedirect: "/login/failed",
  })
);

// GitHub
router.get(
  "/github",
  passport.authenticate("github", { scope: ["profile", "email"] })
);
router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: CLIENT_URI,
    failureRedirect: "/login/failed",
  })
);

// Facebook
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["profile"] })
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: CLIENT_URI,
    failureRedirect: "/login/failed",
  })
);

module.exports = router;
