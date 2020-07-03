const mongoose = require('mongoose')

const EditorSaveSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true,
        default: genID,
    },
    data: {
        type: Array,
        required: true,
    }
})

function genID () {
    let id = '01' + Date.now()
    for (let i = 0; i < 9; i++) {
        id += Math.floor(Math.random()*10)
    }

    return id
}

module.exports = mongoose.model('EditorSave', EditorSaveSchema)