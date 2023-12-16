const User = require("../model/userModel")
const Allchats = require("../model/allchats")
const jwt = require('jsonwebtoken')

exports.getAllchats = async (req, res, next) => {
    try {
        const allchats = await Allchats.findAll({
            attributes: ['message'],
            include: [{
                model: User,
                attributes: ['name']
            }],
            order:[['id','DESC']],
            limit:10
        })
        res.status(200).json(allchats)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: 'some error occured' })
    }
}

exports.postAllchat = async (req, res, next) => {
    try {
        const { uid, message } = req.body
        const userId = jwt.verify(uid, process.env.pvtkey)
        const user = await User.findOne({
            where: {
                id: userId
            }
        })
        const t = await user.createAllchat({
            message: message
        })
        res.status(201).json({message:t.message,name:user.name})
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: 'some error occured' })
    }
}