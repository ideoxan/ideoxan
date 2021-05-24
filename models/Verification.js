const mongoose = require('mongoose')

const VerificationSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    expires: {
        type: Date,
        required: true,
        default: d = new Date().setMinutes(new Date().getMinutes() + 30)
    }
})

module.exports = mongoose.model('verification', VerificationSchema)