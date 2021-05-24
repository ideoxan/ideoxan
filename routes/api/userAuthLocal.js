/* ---------------------------------------------------------------------------------------------- */
/*                                             MODULES                                            */
/* ---------------------------------------------------------------------------------------------- */
/* --------------------------------------- Authentication --------------------------------------- */
const passport                  = require('passport')
/* ------------------------------------------- Models ------------------------------------------- */
const Users                     = require(serverConfig.paths.models + '/User')


/* ---------------------------------------------------------------------------------------------- */
/*                                         INITIALIZATION                                         */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------ Endpoint ------------------------------------------ */
exports.route = 'user/auth/ix'


/* ---------------------------------------------------------------------------------------------- */
/*                                           CONTROLLER                                           */
/* ---------------------------------------------------------------------------------------------- */
exports.post = async (req, res, next) => {
    try {
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
