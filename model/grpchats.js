const Sequelize = require('sequelize')
const sequelize = require('../database/database')

const  groupchat = sequelize.define('groupchat',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    message:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

module.exports = groupchat