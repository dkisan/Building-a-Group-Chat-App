const Sequelize = require('sequelize')
const sequelize = require('../database/database')

const  groupmember = sequelize.define('groupmember',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    }
})

module.exports = groupmember