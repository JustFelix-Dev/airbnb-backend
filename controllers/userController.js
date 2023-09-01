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
const fs = require('fs');
const multer = require('multer');
const postmark = require('postmark');

// Middleware
app.use(cookieParser())

// Registration Email
// const registrationEmail=async(name,email,password)=>{
//      const html = `<style>
//                     @import url('https://fonts.googleapis.com/css2?family=Mukta:wght@400;500;600;700&display=swap');
//                     *{
//                       box-sizing:border-box;
//                       font-family: 'Mukta', sans-serif;
//                     }
//                     </style>
//                     <div style='width:80%;margin:0 auto;font-family: Arial, Helvetica, sans-serif;'>
//                     <img src='cid:airbnbHeader' alt='headerImg' style='display:block;object-fit:cover' width='100%' height='200px'/>
//                       <h2>Hii ${name.split(' ')[0]},</h2>
//                     <p style='max-width:80ch'>Now that you’re part of a global community of guests and Hosts, millions of doors have just opened to you. You'll discover getaways you’ve always dreamed of and places you wouldn’t have known to search for.</p>
//                     <h3>Below are your details upon registration:</h3>
//                       <div style='width:60%;border-radius:10px;border:1px dotted #FF5A5F;margin:0 auto;padding:1rem;box-shadow:rgba(0, 0, 0, 0.35) 0px 5px 15px #333'>
//                       <div><strong>Name</strong> : <span style='font-weight:600;color:green'>${name}</span></div>
//                       <div><strong>Email</strong> : <span style='font-weight:600;color:green'>${email}</span></div>
//                       <div><strong>Password</strong> : <span style='font-weight:600;color:green'>${password}</span></div>
//                       </div>
//                       <p><strong>N.B:</strong> Ensure to be careful with your details.</p>
//                       <p style='margin-block:15px'>Thank You for choosing us!. Be sure that you are going to have the best experience with the state-of-the-art apartments we have available for you.</p>
//                     </div>`;
//     const transporter = nodemailer.createTransport({
//            host: "smtp.gmail.com",
//            port: 465,
//            secure: true,
//            auth:{
//                user: 'owolabifelix78@gmail.com',
//                pass: process.env.GOOGLE_PASS
//            }
//        })
//     const info = await transporter.sendMail({
//            from: 'AirBnb <owolabifelix78@gmail.com>',
//            to: email,
//            subject:'Welcome to AirBnb!',
//            html: html,
//            attachments:[{
//                  filename: 'emailHeader.jpg',
//                  path: './emailImages/emailHeader.jpg',
//                  cid: 'airbnbHeader'
//            }]
//     })
//     console.log('Message Sent:' + info.messageId);
    
// }

// const registrationEmail = async (name, email, password) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const html = `Hello, Welcome to AirBnb!.Your Name is ${name}, and your password ${password}`

//       const transporter = nodemailer.createTransport({
//         host: "smtp.gmail.com",
//         port: 465,
//         secure: true,
//         auth: {
//           user: 'owolabifelix78@gmail.com',
//           pass: process.env.GOOGLE_PASS
//         }
//       });

//       const info = await transporter.sendMail({
//         from: 'AirBnb <owolabifelix78@gmail.com>',
//         to: email,
//         subject: 'Welcome to AirBnb!',
//         html: html,
//         attachments: [{
//           filename: 'emailHeader.jpg',
//           path: './emailImages/emailHeader.jpg',
//           cid: 'airbnbHeader'
//         }]
//       });
    
//       console.log('Message Sent:' + info.messageId);
//       res.status(200).json("Message sent!" + info.messageId)
//       resolve(info.messageId);
//     } catch (error) {
//       console.error('Error sending registration email:', error);
//       res.status(500).json('Error sending registration email:', error)
//       reject(error);
//     }
//   });
// };

// const registrationEmail=async(name,email,password)=>{

// // Create a Nodemailer transporter using the settings
// const transporter = nodemailer.createTransport({
//   host: 'mail.felixdev.com.ng', // Outgoing server (SMTP) hostname
//   port: 26, // SMTP port
//   secure: false, // Use SSL/TLS
//   auth: {
//     user: 'justfelix@felixdev.com.ng', // Your email address
//     pass: process.env.MAILPASS // Your email password
//   }
// });

// // Email options
// const mailOptions = {
//   from: 'justfelix@felixdev.com.ng', // Your email address
//   to: 'owolabifelix78@gmail.com', // Recipient's email address
//   subject: 'Subject of the Email',
//   text: 'This is the text content of the email.Yes!'
// };

// // Send the email
// transporter.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     console.error('Error sending email:', error);
//   } else {
//     console.log('Email sent:', info.response);
//   }
// });

// }

// const registrationEmail=(name,email,password)=>{
//      let transporter = nodemailer.createTransport({
//       service:"gmail",
//       auth:{
//         user: 'owolabifelix78@gmail.com',
//         pass: process.env.GOOGLE_PASS,
//       },
//       tls:{
//           rejectUnauthorized: true,
        
//       },
//      })

//      let mailOption = {
//       from : 'Airbnb <owolabifelix78@gmail.com>',
//       to : email,
//       subject: "Welcome to AirBnb!",
//       text: `Welcome ${name}-Password-${password}`
//      }

//      transporter.sendMail(mailOption).then((response)=>{
//       res.json({message:"Sent",response: response.envelope.to})
//      }).catch((err)=>{
//       console.log(`Error Occured:${err}`)
//      })
// }

const registrationEmail=async (name,email,password)=>{
  return new Promise(async (resolve,reject)=>{
    try{
      const serverToken = process.env.POSTMARK;
      const client = new postmark.ServerClient(serverToken);
      
   const result = client.sendEmail({
        "From": "justfelix@felixdev.com.ng",
        "To": "owolabifelix78@gmail.com",
        "Subject": "Test",
        "TextBody": `Hello From AirBnb,${name},${email},${password}`
      })
      resolve('Email sent successfully',result);
    }catch(error){
      console.error('Error sending email:', error);
      reject('Email sending failed');
    }
  })
}


const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json('Email already exists!');
    }

    if (!name || !email || !password) {
      return res.status(400).json('All fields are required!');
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json('Invalid Email Address!');
    }
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json('Please Choose a Strong Password!');
    }

    const bcryptSalt = bcrypt.genSaltSync();
    const isAdmin = password.includes(process.env.KEY);
   
    try{
      if(!req.file) {
        return res.status(400).json('Photo is required!');
      }
      const { buffer,originalName} = req.file;
       // function to upload to Cloudinary
    const uploadToCloudinary = async (buffer) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
          resource_type: 'image',
          folder: "userImages"
        }, (error, result) => {
          if (error) {
            reject(error); // Reject the promise on error
          } else {
            resolve(result); // Resolve the promise with the result on success
          }
        }).end(buffer);
      });
    }; 
    try {
      // Upload to Cloudinary using the custom promise function
      const uploadedImage = await uploadToCloudinary(buffer);
      const uploadedUrl = uploadedImage.secure_url;
      user = await userModel.create({
        name,
        email,
        admin: isAdmin,
        photo: uploadedUrl,
        rewardPoint: 0,
        badge: 'Bronze',
        password: bcrypt.hashSync(password, bcryptSalt)
      });
          // Send Registration Email
     const emailResult =  await registrationEmail(name, email, password);
     console.log("Email Result:", emailResult);
      res.json({ user, message: 'Registration Successful!',emailResult});
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      res.status(500).json({ error: 'Error uploading to Cloudinary',emailResult: err });
    }
    }catch(error){
      console.error('Error processing file:', error);
      res.status(500).json({ error: 'Error processing file' });
    }
  } catch (err) {
    res.status(422).json(err);
  }
};


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
            const {name,email,_id,photo,admin,rewardPoint,badge} = await userModel.findById(user?.id)
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