const Sequelize = require('sequelize')
const sequelize = require('../database/database')

const  archievedChats = sequelize.define('archievedChats',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    message:{
        type:Sequelize.STRING,
        allowNull:false
    },
    userId:{
        type:Sequelize.INTEGER,
        allowNull:false
    }
})

module.exports = archievedChats