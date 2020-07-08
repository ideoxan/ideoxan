const mongoose = require('mongoose')
const Users = require('./models/Users')

module.exports = {
    user: {
        getUserByUserID: async (userid) => {
            return await Users.findOne({userid: userid})
        },
        getUserByEmail: async (email) => {
            return await Users.findOne({email: email.toLowerCase()})
        },
        getUserByDisplayName: async (displayName) => {
            return await Users.findOne({displayName: displayName.toLowerCase()})
        }
    },
    
}