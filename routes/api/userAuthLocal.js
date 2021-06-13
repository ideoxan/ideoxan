/* ---------------------------------------------------------------------------------------------- */
/*                                             MODULES                                            */
/* ---------------------------------------------------------------------------------------------- */
/* --------------------------------------- Authentication --------------------------------------- */
const passport                  = require('passport')

/* ------------------------------------------ Utilities ----------------------------------------- */
const { validationResult }      = require('express-validator')
const validators                = require(serverConfig.paths.middleware + '/validators')
const { isNotAuth }             = require(serverConfig.paths.middleware + '/authChecker')
const HTTPError                 = require(serverConfig.paths.utilities + '/HTTPError')

/* ------------------------------------------- Models ------------------------------------------- */
const Users                     = require(serverConfig.paths.models + '/User')



/* ---------------------------------------------------------------------------------------------- */
/*                                         INITIALIZATION                                         */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------ Endpoint ------------------------------------------ */
exports.route = 'user/auth/ix'

/* ----------------------------------------- Middlewares ---------------------------------------- */
exports.handlers = []
exports.handlers.post = [
    isNotAuth,
    validators.email('email'),
    validators.password('password')
]



/* ---------------------------------------------------------------------------------------------- */
/*                                           CONTROLLER                                           */
/* ---------------------------------------------------------------------------------------------- */
exports.post = async (req, res, next) => {
    try {
        if (!validationResult(req).isEmpty()) {
            let serverError = new HTTPError(req, res, HTTPError.constants.HTTP_ERROR_CODES['400'])
            return serverError.render()
        }
        let user = await Users.findOne({email: req.body.email || ''}) || null
        if (user) {
            user = user.toObject()
            if (!user.verifiedEmail) return res.redirect(`/verify/ix/email?email=${req.body.email.toLowerCase()}&uid=${user.uid}`)
        } 
        const authenticationOptions = {
            successRedirect: '/app/home',
            failureRedirect: '/login',
            failureFlash: true,
            successFlash: false,
            session: true
        }
        passport.authenticate('local', authenticationOptions)(req, res, next)
    } catch (err) {
        next(err)
    }
}
