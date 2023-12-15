const express = require('express')
const router = express.Router()

const userController = require('../controller/userController')

router.get('/',userController.getHome)

router.post('/user/signup',userController.postSignup)

module.exports = router;
