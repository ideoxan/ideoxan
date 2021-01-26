module.exports = () => {
    if (typeof serverConfig == 'object') return
    try {
        global.serverConfig = require('../../config')
    } catch (err) {
        global.serverConfig = require('../../config.default')
    }
}