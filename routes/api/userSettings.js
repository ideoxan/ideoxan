/* ---------------------------------------------------------------------------------------------- */
/*                                             MODULES                                            */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------- Models ------------------------------------------- */
const Users                     = require(serverConfig.paths.models + '/User')



/* ---------------------------------------------------------------------------------------------- */
/*                                         INITIALIZATION                                         */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------ Endpoint ------------------------------------------ */
exports.route = 'user/settings/'


/* ---------------------------------------------------------------------------------------------- */
/*                                           CONTROLLER                                           */
/* ---------------------------------------------------------------------------------------------- */
exports.get = async (req, res, next) => {
    try {
        if (req.isAuthenticated()) {
            let user = (await Users.findOne({uid: req.session.passport.user})).toObject() || null
            if (!user) return next()

            return res.status(200).json({
                uid: user.uid,
                displayName: user.name,
                username: user.username,
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

}