/* ---------------------------------------------------------------------------------------------- */
/*                                             MODULES                                            */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------- Models ------------------------------------------- */
const Users                     = require(serverConfig.paths.models + '/User')
/* ------------------------------------------ Utilities ----------------------------------------- */
// HTTP Error Codes
const HTTPError                 = require(serverConfig.paths.utilities + '/HTTPError')
const { isAuth }                = require(serverConfig.paths.middleware + '/authChecker')



/* ---------------------------------------------------------------------------------------------- */
/*                                         INITIALIZATION                                         */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------ Endpoint ------------------------------------------ */
exports.route = 'user/terminate'
/* ----------------------------------------- Middlewares ---------------------------------------- */
exports.handlers = []
exports.handlers.post = [
    isAuth,
]



/* ---------------------------------------------------------------------------------------------- */
/*                                           CONTROLLER                                           */
/* ---------------------------------------------------------------------------------------------- */
exports.post = async (req, res, next) => {
    try {
        if (req.isAuthenticated()) {
            let user = await Users.findOne({uid: req.session.passport.user})|| null
            if (!user) return next()

            let userObject = user.toObject()

            if (userObject.roles.includes(40899)) {
                let serverError = new HTTPError(req, res, HTTPError.constants.HTTP_ERROR_CODES['403'])
                return serverError.render()
            }

            await user.deleteOne()
            req.logOut()
            if (req.session) req.session.destroy()
            if (req.accepts('html')) {
                res.redirect('/')
            }
        } else {
            next()
        }
    } catch (err) {
        next(err)
    }
}