const mongoose = require('mongoose')
const Users = require('./models/Users')
const EditorSave = require('./models/EditorSave')

module.exports = {
    users: {
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
    editorSave: {
        getSaveByUserIDAndCourse: async (userid, course) => {
            return await EditorSave.findOne({userid: userid, course: course})
        },
        getSaveByUserID: async (userid) => {
            return await EditorSave.find({userid: userid})
        },
        getSaveByCourse: async (course) => {
            return await EditorSave.find({course: course})
        },
    }
    
}