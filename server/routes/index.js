const express = require('express')
const registeruser = require('../controller/registeruser')
const checkemail = require('../controller/checkemail')
const checkpassword = require('../controller/checkpassword')
const userdetail = require('../controller/userdetail')
const logout = require('../controller/logout')
const updateuserdetails = require('../controller/updateuserdetail')
const searchUser = require('../controller/searchuser')

const router = express.Router()

//create user api
router.post('/register',registeruser)

//check email api
router.post('/email',checkemail)

//check user password
router.post('/password',checkpassword)

//login user details 
router.get('/user-details',userdetail)

//logout user 
router.get('/logout',logout)

//update user details
router.post('/update-user',updateuserdetails)

//search user 
router.post('/search-user',searchUser)
module.exports = router