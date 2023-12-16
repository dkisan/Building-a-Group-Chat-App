const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const cors = require('cors')


dotenv.config()

const app = express()

const sequelize = require('./database/database')

const userRoute = require('./routes/userRoute')
const chatRoute = require('./routes/chatRoute')

const user = require('./model/userModel')
const allchat = require('./model/allchats')

user.hasMany(allchat)
allchat.belongsTo(user)

app.use(bodyParser.json())

app.use(cors({
    origin: '*'
}))

app.use('/chat', chatRoute)
app.use('/', userRoute)

// sequelize.sync({force:true})
sequelize.sync()
    .then(() => {

        app.listen(3000)
    })
    .catch(err=>{
        console.log(err.message)
    })