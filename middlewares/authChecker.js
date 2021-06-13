const HTTPError = require(serverConfig.paths.utilities + '/HTTPError')
const Users = require(serverConfig.paths.models + '/User')

module.exports = {
    isAuth: async (req, res, next) => {
        try {
            if (req.isAuthenticated()) {
                let user = await Users.findOne({uid: req.session.passport.user}) || null
                if (!user) return _404(req, res)
                return next()
            } else return _404(req, res)
        } catch (err) {
            next(err)
        }
        
    },
    isNotAuth: async (req, res, next) => {
        try {
            if (req.isAuthenticated()) {
                return _404(req, res)
            } else return next()
        } catch (err) {
            next(err)
        }
    }
}

function _404 (req, res) {
    let serverError = new HTTPError(req, res, HTTPError.constants.HTTP_ERROR_CODES['404'])
    return serverError.render()
}