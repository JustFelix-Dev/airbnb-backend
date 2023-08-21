const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const Location = require('../models/Locations');
const app = express();

// Middleware
app.use(cookieParser())

const postPlaces = async(req,res)=>{
          const {token}= req.cookies;
          const { title,address,photos,
            photoLink,description,perks,
            extraInfo,checkIn,checkOut,maxGuests,price} = req.body;
          jwt.verify(token,process.env.SECRET,{},async(err,user)=>{
            if(err) throw err;
            const placeDoc = await Location.create({
                        owner: user.id,
                        title,address,photos,
                        photoLink,description,perks,
                        extraInfo,checkIn,checkOut,guests:maxGuests,price
               })
               res.json(placeDoc)
          })
}

const getAllPlaces = async(req,res)=>{
            const allPlaces = await Location.find()
            res.json(allPlaces)
        }

 const getPlaces =async(req,res)=>{
    const {token}= req.cookies;
    jwt.verify(token,process.env.SECRET,{},async(err,user)=>{
        if(err) throw err;
             const {id} = user;
             const places = await Location.find({owner:id})
             res.json(places)
           })
}

const getEachPlace = async(req,res)=>{
      const {id} = req.params;
      const doc = await Location.findById(id)
      res.json(doc)
}

    const filteredPlace = async (req, res) => {
      try {
        const location = req.query?.place;
        const leastPrice = req.query?.leastPrice;
        const highPrice = req.query?.highPrice;

        if (!location && !leastPrice && !highPrice) {
          return res.status(400).json('Please provide valid filter parameters.');
        }

        let query = {};

        if (location) {
          query.address = { $regex: location, $options: 'i' };
        }

        if (leastPrice && highPrice) {
          query.price = { $gte: leastPrice, $lte: highPrice };
        }

        const filteredLocations = await Location.find(query);

        if (filteredLocations.length === 0) {
          return res.status(401).json('Sorry, no locations match your criteria.');
        }

        res.status(200).json(filteredLocations);
      } catch (err) {
        console.error('Error:', err);
        return res.status(500).json('Something went wrong!');
      }
    };


const editPlace = async(req,res)=>{
      const {id} = req.params;
       const {formBody}  = req.body;
       try{
        const updatedItem =   await Location.findOneAndUpdate({_id: id},{$set:{...req.body,formBody}})
        if(!updatedItem){
         return res.status(400).json("Location not found!")
        }
        res.status(200).json('Location Updated Successfully!')
       }catch(err){
           res.status(500).json('Something went wrong!')
       }
}

const deletePlace = async(req,res)=>{
  const {id} = req.params;
  try{
    const deletedItem =  await Location.findOneAndDelete({_id: id})
    if(!deletedItem){
     return res.status(401).json('Location Not Found!')
    }
       res.status(201).json("Location successfully deleted!")
  }catch(err){
    return  res.status(503).json('Server Error!')
  }
}

module.exports = { postPlaces, getPlaces, getEachPlace,getAllPlaces,editPlace,deletePlace,filteredPlace};