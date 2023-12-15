const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const cors = require('cors')


dotenv.config()

const app = express()

const sequelize = require('./database/database')

const userRoute = require('./routes/userRoute')

app.use(bodyParser.json())

app.use(cors({
    origin: '*'
}))

app.use('/', userRoute)

sequelize.sync()
    .then(() => {

        app.listen(3000)
    })