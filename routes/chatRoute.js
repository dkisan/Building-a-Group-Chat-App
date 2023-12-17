const express = require('express')
const router = express.Router()

const chatController = require('../controller/chatController')

router.get('/getusers',chatController.getAllUsers)
router.get('/:groupid',chatController.getAllchats)
router.get('/group/get',chatController.getGroups)
router.post('/group/create',chatController.postCreateGroup)
router.post('/group/addtogroup',chatController.postAddToGroup)
router.post('/allchat/:grpid',chatController.postAllchat)

module.exports = router;
