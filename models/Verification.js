const mongoose = require('mongoose')

const VerificationSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        maxLength: 256,
        trim: true,
    },
    code: {
        type: String,
        required: true,
        lowercase: true,
        minLength: 6,
        maxLength: 6,
        trim: true,
    },
    expires: {
        type: Date,
        required: true,
        default: new Date().setMinutes(new Date().getMinutes() + 30)
    }
})

module.exports = mongoose.model('verification', VerificationSchema)