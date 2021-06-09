/* ---------------------------------------------------------------------------------------------- */
/*                                             MODULES                                            */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------- Models ------------------------------------------- */
const Users                     = require(serverConfig.paths.models + '/User')
/* ------------------------------------------ Utilities ----------------------------------------- */
// HTTP Error Codes
const HTTPError                 = require(serverConfig.paths.utilities + '/HTTPError')



/* ---------------------------------------------------------------------------------------------- */
/*                                         INITIALIZATION                                         */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------ Endpoint ------------------------------------------ */
exports.route = 'user/profile/:username'


/* ---------------------------------------------------------------------------------------------- */
/*                                           CONTROLLER                                           */
/* ---------------------------------------------------------------------------------------------- */
exports.get = async (req, res, next) => {
    try {
        let requestedUser = await Users.findOne({username: req.params.username}) || null
        if (!requestedUser) return next()

        requestedUser = requestedUser.toObject()

        if (!requestedUser.public) {
            if (!req.isAuthenticated()) return next()
            if (req.session.passport.user !== requestedUser.uid) return next()
        }

        return res.status(200).json({
            uid: requestedUser.uid,
            username: requestedUser.username,
            displayName: requestedUser.name,
            roles: requestedUser.roles,
            created: requestedUser.created,
            lastLogin: requestedUser.lastLogin,
            bio: requestedUser.bio,
            connections: {
                github: requestedUser.connections.github
            },
            public: requestedUser.public
        })
    } catch (err) {
        next(err)
    }
}