const express = require('express')
const router = express.Router()

const userController = require('../controller/userController')

router.get('/chatapp',userController.getChatapp)
router.get('/login',userController.getLogin)
router.get('/',userController.getHome)

router.post('/user/signup',userController.postSignup)
router.post('/user/login',userController.postLogin)

module.exports = router;
