const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const ConnectionsSchema = new mongoose.Schema({
    github: {
        type: String,
        required: false,
        default: null
    }
})

const UserSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        default: uuidv4()
    },
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    roles: {
        type: Array,
        required: true,
        default: [0]
    },
    created: {
        type: Date,
        required: true,
        default: Date.now().toString(),
    },
    lastLogin: {
        type: Date,
        required: true,
        default: Date.now().toString(),
    },
    loginStreak: {
        type: Number,
        required: true,
        default: 0,
    },
    bio: {
        type: String,
        maxlength: 250,
        required: false,
        default: 'Hello, World! I am a new Ideoxan user!'
    },
    connections: {
        type: ConnectionsSchema,
        required: true,
        default: {
            github: null
        }
    }
})

module.exports = mongoose.model('users', UserSchema)