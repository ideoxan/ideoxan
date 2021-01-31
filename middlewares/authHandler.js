const Users = require(serverConfig.paths.models + '/User')
const localAuth = require(serverConfig.paths.middleware + '/localAuth')

module.exports = (passport) => {
    passport.use('local', localAuth)

    passport.serializeUser((user, done) => {
        done(null, user.uid)
    })

    passport.deserializeUser((uid, done) => {
        done(null, Users.findOne({uid: uid}))
    })
}