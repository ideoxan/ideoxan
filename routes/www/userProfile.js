/* ---------------------------------------------------------------------------------------------- */
/*                                             MODULES                                            */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------- Models ------------------------------------------- */
const Users                     = require(serverConfig.paths.models + '/User')

/* ------------------------------------------ Utilities ----------------------------------------- */
const render                    = require(serverConfig.paths.utilities + '/render')



/* ---------------------------------------------------------------------------------------------- */
/*                                         INITIALIZATION                                         */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------ Endpoint ------------------------------------------ */
exports.route = '@:requestedUser'



/* ---------------------------------------------------------------------------------------------- */
/*                                           CONTROLLER                                           */
/* ---------------------------------------------------------------------------------------------- */
exports.get = async (req, res, next) => {
    let requestedUser = await Users.findOne({username: req.params.requestedUser})
    if (!requestedUser) return next()
    requestedUser = requestedUser.toObject()

    if (!requestedUser.public) {
        if (!req.isAuthenticated()) return next()
        if (req.session.passport.user !== requestedUser.uid) return next()
        return res.redirect('/app/me')
    } else {
        if (!req.isAuthenticated()) return render('user')(req, res, next)
        if (req.session.passport.user !== requestedUser.uid) return render('user')(req, res, next)
        return res.redirect('/app/me')
    }
}
