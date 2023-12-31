const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer()

const chatController = require('../controller/chatController')

router.get('/getusers',chatController.getAllUsers)
router.get('/:groupid',chatController.getAllchats)
router.get('/group/get',chatController.getGroups)
router.post('/group/remove',chatController.postRemoveFromGroup)
router.post('/group/uploadimg/:grpid/:uid',upload.single('images'),chatController.postUploadImg)
router.get('/group/getmember/:grpid',chatController.getGroupMembers)
router.post('/group/create',chatController.postCreateGroup)
router.post('/group/addtogroup',chatController.postAddToGroup)
router.post('/group/makeadmin',chatController.postMakeadmin)
router.post('/allchat/:grpid',chatController.postAllchat)

module.exports = router;
