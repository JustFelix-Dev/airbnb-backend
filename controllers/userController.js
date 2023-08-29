const express = require('express');
const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { configDotenv } = require('dotenv');
configDotenv();
const app = express();
const nodemailer = require('nodemailer');
const validator = require('validator');
const cloudinary = require('../uploadImages');

// Middleware
app.use(cookieParser())

// Registration Email
const registrationEmail=async(name,email,password)=>{
     const html = `<style>
                    @import url('https://fonts.googleapis.com/css2?family=Mukta:wght@400;500;600;700&display=swap');
                    *{
                      box-sizing:border-box;
                      font-family: 'Mukta', sans-serif;
                    }
                    </style>
                    <div style='width:80%;margin:0 auto;font-family: Arial, Helvetica, sans-serif;'>
                    <img src='cid:airbnbHeader' alt='headerImg' style='display:block;object-fit:cover' width='100%' height='200px'/>
                      <h2>Hii ${name.split(' ')[0]},</h2>
                    <p style='max-width:80ch'>Now that you’re part of a global community of guests and Hosts, millions of doors have just opened to you. You'll discover getaways you’ve always dreamed of and places you wouldn’t have known to search for.</p>
                    <h3>Below are your details upon registration:</h3>
                      <div style='width:60%;border-radius:10px;border:1px dotted #FF5A5F;margin:0 auto;padding:1rem;box-shadow:rgba(0, 0, 0, 0.35) 0px 5px 15px #333'>
                      <div><strong>Name</strong> : <span style='font-weight:600;color:green'>${name}</span></div>
                      <div><strong>Email</strong> : <span style='font-weight:600;color:green'>${email}</span></div>
                      <div><strong>Password</strong> : <span style='font-weight:600;color:green'>${password}</span></div>
                      </div>
                      <p><strong>N.B:</strong> Ensure to be careful with your details.</p>
                      <p style='margin-block:15px'>Thank You for choosing us!. Be sure that you are going to have the best experience with the state-of-the-art apartments we have available for you.</p>
                    </div>`;
    const transporter = nodemailer.createTransport({
           host: "smtp.gmail.com",
           port: 465,
           secure: true,
           auth:{
               user: 'owolabifelix78@gmail.com',
               pass: process.env.GOOGLE_PASS
           }
       })
    const info = await transporter.sendMail({
           from: 'AirBnb <owolabifelix78@gmail.com>',
           to: email,
           subject:'Welcome to AirBnb!',
           html: html,
           attachments:[{
                 filename: 'emailHeader.jpg',
                 path: './emailImages/emailHeader.jpg',
                 cid: 'airbnbHeader'
           }]
    })
    console.log('Message Sent:' + info.messageId);
    
}

 const registerUser = async(req,res)=>{
   const { name,email,password,photo } = req.body;
    try{
         let user = await userModel.findOne({email});
         if(user){
            return res.status(400).json('Email already exists!');
         }
         
         if(!name || !email || !password || !photo){
            return res.status(400).json("All fields are required!");
         }

         if(!validator.isEmail(email)){
          return res.status(400).json("Invalid Email Address!");
         }
         if(!validator.isStrongPassword(password)){
          return res.status(400).json("Please Choose a Strong Password!");
         }
         const bcryptSalt  = bcrypt.genSaltSync();
         const isAdmin = password.includes(process.env.KEY);
         const result = await cloudinary.uploader.upload( photo,{
           public_id: "profile/" + Date.now(),
           folder: "userImages"
         })
         const resultUrl = result.secure_url;
       user = await userModel.create({name,email,admin:isAdmin,photo:resultUrl,
        rewardPoint:0,badge:'Bronze',password:bcrypt.hashSync(password,bcryptSalt)})
        res.json({user,message:'Registration Successful!'})
        registrationEmail(name,email,password)
    }
    catch(err){
        res.status(422).json(err)
    }
}

const loginUser = async(req,res)=>{
    try{
         const { email,password } = req.body;
         const user = await userModel.findOne({email})
         if(user){
            const isMatched = bcrypt.compareSync(password, user.password)
            if(isMatched){
                  jwt.sign({email:user.email,id:user._id,photo:user.photo,admin:user.admin,badge:user.badge,rewardPoint:user.rewardPoint},process.env.SECRET,(err,token)=>{
                    if(err) throw err;
                    res.cookie('token',token,{secure:true,sameSite:'none',domain:'.felixdev.com.ng'}).json(user)
                  }) 
            }else{
                res.status(402).json('Wrong credentials!')
            }
         }else{
            res.status(401).json('Wrong credentials!')
         }
    }
    catch(err){
        res.status(422).json(err)
    }
}

const userProfile =(req,res)=>{
      const  {token} = req.cookies;
      if(token){
          jwt.verify(token,process.env.SECRET,{},async(err,user)=>{
            if(err) throw err;
            const {name,email,_id,photo,admin,rewardPoint,badge} = await userModel.findById(user.id)
            res.json({name,email,_id,photo,admin,rewardPoint,badge})
          })
      }else{
           res.json(null)
      }
}

const findUser=async(req,res)=>{
  const {userId} = req.params;
  try{
     const user = await userModel.findById(userId)
     res.status(200).json(user)
  }catch(err){
    console.log(err)
    res.status(501).json(err.message) 
  }
}

const getUsers=async(req,res)=>{
  try{
     const users = await userModel.find()
     res.status(200).json(users)
  }catch(err){
    console.log(err)
    res.status(501).json(err.message) 
  }
}


 const logoutUser = (req,res)=>{
      res.cookie('token','',{secure:true,sameSite:'none',domain:'.felixdev.com.ng'}).json(true)
 }


module.exports={registerUser,loginUser,userProfile,logoutUser,findUser,getUsers};