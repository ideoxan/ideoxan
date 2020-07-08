const mongoose = require('mongoose')

const EditorSaveSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true,
    },
    course:{
        type: String,
        requires: true,
    },
    data: {
        type: Array,
        required: true,
        default: []
    }
})

module.exports = mongoose.model('EditorSave', EditorSaveSchema)