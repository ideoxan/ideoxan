const mongoose = require('mongoose')

const UsersSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true,
        default: genID,
    },
    displayName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        required: true,
        default: Date.now().toString()
    },
    roles: {
        type: Array,
        required: true,
        default: [0]
    }
})

function genID () {
    let id = '01' + Date.now()
    for (let i = 0; i < 9; i++) {
        id += Math.floor(Math.random()*10)
    }

    return id
}

module.exports = mongoose.model('Users', UsersSchema)