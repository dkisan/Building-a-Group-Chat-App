const User = require("../model/userModel")
const Allchats = require("../model/allchats")
const jwt = require('jsonwebtoken');
const groupchat = require("../model/grpchats");
const chatgroup = require("../model/chatGroup");
const groupmember = require("../model/groupmember");
const sequelize = require("../database/database");

exports.getAllchats = async (req, res, next) => {
    try {
        let allchats;
        if (req.params.groupid === '0') {
            allchats = await Allchats.findAll({
                attributes: ['message'],
                include: [{
                    model: User,
                    attributes: ['name']
                }],
                order: [['id', 'DESC']],
                limit: 10
            })
        } else {
            const uid = req.headers.uid
            const userId = jwt.verify(uid, process.env.pvtkey)
            const user = await User.findOne({
                where: {
                    id: userId
                }
            })
            const grps = await user.getChatgroups({
                where: {
                    id: +req.params.groupid
                }
            })
            if (grps) {
                allchats = await groupchat.findAll({
                    where: {
                        chatgroupId: +req.params.groupid
                    },
                    attributes: ['message'],
                    include: [{
                        model: User,
                        attributes: ['name']
                    }],
                    order: [['id', 'DESC']],
                    limit: 10
                })
                // console.log(grps)
            }
        }
        res.status(200).json(allchats)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: 'some error occured' })
    }
}

exports.postAllchat = async (req, res, next) => {
    try {
        const grpid = req.params.grpid
        const { uid, message } = req.body
        const userId = jwt.verify(uid, process.env.pvtkey)
        const user = await User.findOne({
            where: {
                id: userId
            }
        })
        let t;
        if (grpid == '0') {
            t = await user.createAllchat({
                message: message
            })
        } else {
            t = await user.createGroupchat({
                message: message,
                chatgroupId: +grpid
            })
        }
        res.status(201).json({ message: t.message, name: user.name })
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: 'some error occured' })
    }
}

exports.postCreateGroup = async (req, res, next) => {
    const t = await sequelize.transaction()
    try {
        const { groupname, uid } = req.body
        const userId = jwt.verify(uid, process.env.pvtkey)
        const user = await User.findOne({
            where: {
                id: userId
            }
        })
        const gname = await user.createChatgroup({
            groupname: groupname,
            admins: `${user.id}`
        },
            { transaction: t }
        )
        await t.commit()
        res.status(200).json(gname.groupname)
    } catch (err) {
        await t.rollback()
        res.status(500).json({ message: 'some error occured' })
    }
}


exports.getGroups = async (req, res, next) => {
    try {
        const { uid } = req.headers
        const userId = jwt.verify(uid, process.env.pvtkey)
        const user = await User.findOne({
            where: {
                id: userId
            }
        })

        const groups = await user.getChatgroups()
        const filtergroup = groups.map(e => {
            return { id: e.id, groupname: e.groupname }
        })
        res.status(200).json(filtergroup)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: 'some error occured' })
    }
}

exports.getGroupMembers = async (req, res, next) => {
    try {
        const { grpid } = req.params

        const grp = await groupmember.findAll({
            where: {
                chatgroupId: +grpid
            },
            attributes: ['userId']
        })

        let promises = grp.map(async element => {
            const grpuser = await User.findByPk(element.userId)
            return { name: grpuser.name, email: grpuser.email }
        })

        Promise.all(promises)
            .then((results) => {
                res.status(200).json(results)
            })


    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: 'some error occured' })
    }
}


exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll({
            attributes: ['name', 'email']
        })
        res.status(200).json(users)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: 'some error occured' })
    }
}

exports.postAddToGroup = async (req, res, next) => {
    const { grpid, pplid, uid } = req.body
    try {
        const userId = jwt.verify(uid, process.env.pvtkey)
        const user = await User.findOne({
            where: {
                id: userId
            }
        })
        const isGrpMember = await user.getChatgroups({
            where: {
                id: +grpid
            }
        })


        if (isGrpMember) {
            let admins = isGrpMember[0].admins.split(',')
            if (admins.includes(`${user.id}`)) {

                const ppl = await User.findOne({
                    where: {
                        email: pplid
                    }
                })

                const a = await ppl.addChatgroup(isGrpMember)

                if (a[0]) {
                    res.status(200).json({ message: 'Added to Group Successfully' })
                } else {
                    res.status(200).json({ message: 'Already a Group Member' })
                }
            } else {
                res.status(200).json({ message: 'You have not permission to do this' })
            }

        }
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: 'some error occured' })
    }
}



exports.postMakeadmin = async (req, res, next) => {
    const { grpid, pplid, uid } = req.body
    try {
        const userId = jwt.verify(uid, process.env.pvtkey)
        const user = await User.findOne({
            where: {
                id: userId
            }
        })
        const grp = await chatgroup.findOne({
            where: {
                id: +grpid
            }
        })
        let admins = grp.admins.split(',')
        if (admins.includes(`${user.id}`)) {
            const ppl = await User.findOne({
                where: {
                    email: pplid
                }
            })
            if (admins.indexOf(`${ppl.id}`) >= 0) {
                res.status(200).json({ message: 'Already admin of this Group' })
            } else {
                admins.push(`${ppl.id}`)
                admins = admins.join(',')
                await grp.update({
                    admins: `${admins}`
                })
                res.status(200).json({ message: 'Became admin Successfully' })
            }
        } else {
            res.status(200).json({ message: 'You have not permission to do this' })
        }
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: 'some error occured' })
    }
}



exports.postRemoveFromGroup = async (req, res, next) => {
    const { grpid, pplid, uid } = req.body
    const t = await sequelize.transaction()
    try {
        const userId = jwt.verify(uid, process.env.pvtkey)
        const user = await User.findOne({
            where: {
                id: userId
            }
        })
        const isGrpMember = await user.getChatgroups({
            where: {
                id: +grpid
            }
        })


        if (isGrpMember) {
            let admins = isGrpMember[0].admins.split(',')
            if (admins.includes(`${user.id}`)) {

                const ppl = await User.findOne({
                    where: {
                        email: pplid
                    }
                })
                const chtgrp = await chatgroup.findOne({
                    where: {
                        id: +grpid
                    }
                })

                if (admins.includes(`${ppl.id}`)) {
                    const a = admins.filter(item => item != `${ppl.id}`)
                    admins = a.join(',')

                    if (admins.length > 0) {
                        await chtgrp.update({
                            admins: `${admins}`
                        },
                            { transaction: t })
                    }
                }
                const a = await ppl.removeChatgroup(isGrpMember, { transaction: t })
                if (admins.length == 0) {
                    await chtgrp.destroy({ transaction: t })
                }
                if (a) {
                    await t.commit()
                    res.status(200).json({ message: 'Removed From Group Successfully' })
                }
            } else {
                res.status(200).json({ message: 'You have not permission to do this' })
            }
        }
    } catch (err) {
        await t.rollback()
        console.log(err.message)
        res.status(500).json({ message: 'some error occured' })
    }
}