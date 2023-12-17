const Sequelize = require('sequelize')
const sequelize = require('../database/database')

const  chatgroup = sequelize.define('chatgroup',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    groupname:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

module.exports = chatgroup