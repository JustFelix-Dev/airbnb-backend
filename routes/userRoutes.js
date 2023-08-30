const express = require('express');
const { registerUser, loginUser, userProfile, logoutUser, findUser, getUsers } = require('../controllers/userController');
const router = express.Router();
const multer = require('multer');


const photoMiddleWare = multer({
    storage: multer.memoryStorage()
  }).single('photo');
  

router.post('/register',photoMiddleWare,registerUser)
router.post('/login',loginUser)
router.get('/profile',userProfile)
router.post('/logout',logoutUser)
router.get('/find/:userId',findUser)
router.get('/users',getUsers)

module.exports = router