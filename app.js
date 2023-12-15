const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')


dotenv.config()

const app = express()

const sequelize = require('./database/database')

const userRoute = require('./routes/userRoute')

app.use(bodyParser.json())

app.use('/', userRoute)

sequelize.sync()
    .then(() => {

        app.listen(3000)
    })