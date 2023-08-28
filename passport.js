const passport = require('passport');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const { configDotenv } = require('dotenv');
configDotenv();
const userModel = require('./models/user');
const  jwt  = require('jsonwebtoken');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GithubStrategy = require('passport-github2').Strategy;
app.use(cookieParser());


// Google
const GOOGLE_CLIENT_ID = process.env.GOOGLE_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_SECRET;

// GitHub 
const GITHUB_CLIENT_ID = process.env.GITHUB_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_SECRET;

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    passReqToCallback: true
  },
  async function(req,accessToken, refreshToken, profile, done){
    //   Check If user exists
    try{
       let existingUser =  await userModel.findOne({email:profile.emails[0].value})
       if(existingUser){
        const token = jwt.sign({email:existingUser.email,id:existingUser._id,admin:existingUser.admin},process.env.SECRET);
        req.res.cookie('token',token,{secure:true,sameSite:'none',domain:'.felixdev.com.ng'});
        console.log(existingUser)
          return done(null,existingUser)
       }
       if(!existingUser){
          const newUser = new userModel({
              name: profile.displayName,
              email: profile.emails[0].value,
              photo: profile.photos[0].value,
              rewardPoint: 0,
              badge: 'Bronze',
              admin: false
          });
          existingUser = await newUser.save();
          // Generate the JWT token with the user data
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id,photo: existingUser.photo,admin:existingUser.admin,rewardPoint:existingUser.rewardPoint,badge:existingUser.badge}, process.env.SECRET);
        // Set the token as a cookie in the response
        req.res.cookie('token', token,{secure:true,sameSite:'none',domain:'.felixdev.com.ng'});
        // Respond with the existing user data as JSON
        return done(null, existingUser);
       }
    }catch(err){
        return done(err)
    }
    
  }
));

passport.use(new GithubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback",
    passReqToCallback: true

  },
  async function(req,accessToken, refreshToken, profile, done){
    //   Check If user exists
    try{
        let existingUser =  await userModel.findOne({email:profile?.emails[0].value})
        if(existingUser){
         const token = jwt.sign({email:existingUser.email,id:existingUser._id,admin:existingUser.admin},process.env.SECRET);
         req.res.cookie('token',token,{secure:true,sameSite:'none',domain:'.felixdev.com.ng'});
         console.log(existingUser)
           return done(null,existingUser)
        }
        if(!existingUser){
           const newUser = new userModel({
               name: profile.displayName,
               email: profile.emails[0].value,
               photo: profile.photos[0].value,
               rewardPoint: 0,
               badge: 'Bronze',
               admin:false
           });
           existingUser = await newUser.save();
         const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.SECRET);
         req.res.cookie('token', token,{secure:true,sameSite:'none',domain:'.felixdev.com.ng'});
         return done(null, existingUser);
        }
     }catch(err){
         return done(err)
     }
  }
));

passport.serializeUser((user,done)=>{
      done(null,user)
})
passport.deserializeUser((user,done)=>{
    done(null,user)
})