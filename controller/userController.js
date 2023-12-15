const path = require('path')
const User = require('../model/userModel')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')


exports.getHome = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../views/', 'signup.html'))
}

exports.getLogin = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../views/', 'login.html'))
}

exports.getChatapp = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../views/', 'chatwindow.html'))
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
            return res.status(200).json({ message: 'User Already Exist Please Login' })
        }
    } catch (err) {
        return res.status(500).json({ message: 'Some Error Occured' })
    }
}



exports.postLogin = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({
            where: {
                email: email
            }
        })
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    var token = jwt.sign(user.id, process.env.pvtkey)
                    return res.status(200).json({ message: "User Login Successfully", userid: token, name: user.name })
                } else {
                    return res.status(200).json({ message: "Incorrect Credentials" })
                }
            })
        } else {
            return res.status(200).json({ message: 'User Not Found' })
        }
    } catch (err) {
        return res.status(500).json({ message: 'Some Error Occured' })
    }
}