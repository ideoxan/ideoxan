const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const ConnectionsSchema = new mongoose.Schema({
    github: {
        type: String,
        required: false,
        default: null,
        minLength: 12,
        maxLength: 256,
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
        lowercase: true,
        maxLength: 256,
        trim: true,
    },
    verifiedEmail: {
        type: Boolean,
        required: true,
        default: false
    },
    username: {
        type: String,
        required: true,
        maxLength: 36,
        minLength: 3,
        trim: true
    },
    name: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 256,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 256
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
        maxLength: 1024,
        trim: true,
        required: false,
        default: 'Hello, World! I am a new Ideoxan user!'
    },
    connections: {
        type: ConnectionsSchema,
        required: true,
        default: {
            github: null
        }
    },
    public: {
        type: Boolean,
        required: true,
        default: true
    }
})

module.exports = mongoose.model('users', UserSchema)