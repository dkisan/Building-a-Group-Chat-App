const path = require('path')
const User = require('../model/userModel')
const bcrypt = require('bcrypt')
const saltRounds = 10

exports.getHome = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../views/', 'signup.html'))
}


exports.postSignup = async (req, res, next) => {
    const { name, email, phonenumber, password } = req.body
    try {
        const isNew = await User.findOne({
            where: {
                email: email
            }
        })
        if (!isNew) {
            bcrypt.genSalt(saltRounds, (err, salt) => {
                if (err) throw new Error
                bcrypt.hash(password, salt, async (err, hash) => {
                    await User.create({
                        name: name,
                        email: email,
                        phonenumber: phonenumber,
                        password: hash
                    })
                })
            })
            return res.status(201).json({ message: 'User Created successfully' })
        } else {
            return res.status(200).json({ message: 'User Already Exist' })
        }
    } catch (err) {
        return res.status(500).json({ message: 'Some Error Occured' })
    }
}