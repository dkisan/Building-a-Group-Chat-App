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
const chatgroup = require('./model/chatGroup')
const groupmember = require('./model/groupmember')
const groupchat = require('./model/grpchats')

user.hasMany(allchat)
allchat.belongsTo(user)

chatgroup.hasMany(groupchat)
user.hasMany(groupchat)
groupchat.belongsTo(user)
groupchat.belongsTo(chatgroup)

user.belongsToMany(chatgroup, { through: groupmember })
chatgroup.belongsToMany(user, { through: groupmember })



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
    .then(() => {

        console.log('server started')
    })
    .catch(err => {
        console.log(err.message)
    })