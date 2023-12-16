const express = require('express')
const router = express.Router()

const chatController = require('../controller/chatController')

router.get('/getallchats',chatController.getAllchats)
router.post('/allchat',chatController.postAllchat)

module.exports = router;
