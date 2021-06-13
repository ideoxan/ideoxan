/* ---------------------------------------------------------------------------------------------- */
/*                                             MODULES                                            */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------- Models ------------------------------------------- */
const Users                     = require(serverConfig.paths.models + '/User')
/* ------------------------------------------ Utilities ----------------------------------------- */
// HTTP Error Codes
const HTTPError                 = require(serverConfig.paths.utilities + '/HTTPError')
const { validationResult }      = require('express-validator')
const validators                = require(serverConfig.paths.middleware + '/validators')
const { isAuth }                = require(serverConfig.paths.middleware + '/authChecker')



/* ---------------------------------------------------------------------------------------------- */
/*                                         INITIALIZATION                                         */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------ Endpoint ------------------------------------------ */
exports.route = 'user/settings/'
/* ----------------------------------------- Middlewares ---------------------------------------- */
exports.handlers = []
exports.handlers.get = [
    isAuth,
]
exports.handlers.post = [
    isAuth,
    validators.displayName('displayName').optional(),
    validators.email('email').optional(),
    validators.username('username').optional(),
    validators.bio('bio').optional(),
    validators.connections.ghProfile('ghProfile').optional(),
    validators.public('public').optional()
]



/* ---------------------------------------------------------------------------------------------- */
/*                                           CONTROLLER                                           */
/* ---------------------------------------------------------------------------------------------- */
exports.get = async (req, res, next) => {
    try {
        if (req.isAuthenticated()) {
            let user = await Users.findOne({uid: req.session.passport.user})|| null
            if (!user) return next()

            user = user.toObject()

            return res.status(200).json({
                uid: user.uid,
                displayName: user.name,
                username: user.username,
                email: user.email,
                bio: user.bio,
                connections: user.connections,
                publicProfile: user.public
            })
        } else {
            next()
        }
    } catch (err) {
        next(err)
    }
}

exports.post = async (req, res, next) => {
    try {
        if (req.isAuthenticated()) {
            if (!validationResult(req).isEmpty()) {
                let serverError = new HTTPError(req, res, HTTPError.constants.HTTP_ERROR_CODES['400'])
                return serverError.render()
            }
            
            let user = await Users.findOne({uid: req.session.passport.user}) || null
            if (!user) return next()
            let settingType = req.query.type || null

            switch (settingType) {
                case 'displayName':
                    user.name = req.body.displayName
                    await user.save()
                    res.status(204).redirect('/app/settings')
                    break
                case 'email':
                    user.email = req.body.email
                    user.verifiedEmail = false
                    await user.save()
                    res.status(204)
                    req.logout()
                    if (req.session) req.session.destroy()
                    res.redirect(`/verify/ix/email?email=${user.email}&uid=${user.uid}`)
                    break
                case 'username':
                    user.username = req.body.username.toLowerCase()
                    await user.save()
                    res.status(204).redirect('/app/settings')
                    break
                case 'bio':
                    user.bio = req.body.bio || null
                    await user.save()
                    res.status(204).redirect('/app/settings')
                    break
                case 'ghProfile':
                    user.connections.github = req.body.ghProfile || null
                    await user.save()
                    res.status(204).redirect('/app/settings')
                    break
                case 'public':
                    user.public = req.body.public == 'on' // html moment
                    await user.save()
                    res.status(204).redirect('/app/settings')
                    break
                default:
                    let serverError = new HTTPError(req, res, HTTPError.constants.HTTP_ERROR_CODES['400'])
                    serverError.render()
                    break
            }
        } else {
            next()
        }
    } catch (err) {
        next(err)
    }
    
}