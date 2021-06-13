/* ---------------------------------------------------------------------------------------------- */
/*                                             MODULES                                            */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------- Models ------------------------------------------- */
const Users                     = require(serverConfig.paths.models + '/User')
/* --------------------------------------- Authentication --------------------------------------- */
const bcrypt                    = require('bcryptjs')
/* ------------------------------------------ Utilities ----------------------------------------- */
const { validationResult }      = require('express-validator')
const validators                = require(serverConfig.paths.middleware + '/validators')
const { isNotAuth }             = require(serverConfig.paths.middleware + '/authChecker')


/* ---------------------------------------------------------------------------------------------- */
/*                                         INITIALIZATION                                         */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------ Endpoint ------------------------------------------ */
exports.route = 'user/create/'
/* ----------------------------------------- Middlewares ---------------------------------------- */
exports.handlers = []
exports.handlers.post = [
    isNotAuth,
    validators.email('email'),
    validators.username('username'),
    validators.password('password')
]


/* ---------------------------------------------------------------------------------------------- */
/*                                           CONTROLLER                                           */
/* ---------------------------------------------------------------------------------------------- */
exports.post = (req, res, next) => {
    try {
        if (!validationResult(req).isEmpty()) {
            req.flash('error', 'Invalid username, email, or password')
            return res.redirect('/signup')
        }
        bcrypt.hash(req.body.password, Number.parseInt(process.env.PWD_HASH), async (err, pwdHash) => {
            if (err) next(err)

            let email = req.body.email.toLowerCase()
            let username = req.body.username.toLowerCase()
            let displayName = username // Just temporary until the user sets it themselves
            let uid

            await Users.create({
                email: email,
                username: username,
                name: displayName,
                password: pwdHash
            })

            uid = (await Users.findOne({email: email})).toObject().uid

            return res.redirect(`/verify/ix/email?email=${req.body.email.toLowerCase()}&uid=${uid}`)
        })
        
    } catch (err) {
        next(err)
    }
}