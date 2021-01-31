const LocalStrategy = require('passport-local').Strategy
const Users = require(serverConfig.paths.models + '/User')
const bcrypt = require('bcryptjs')

const invalidMessage        = 'The email or password you have entered is incorrect'
const permanentBanMessage   = 'User has been permanently banned'
const temporaryBanMessage   = 'User has been temporarily restricted'

module.exports = new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done) => {
        try {
            const user = await Users.findOne({email: email.toLowerCase()})

            if (user == null) return done(null, false, {message: invalidMessage})
            if (user.roles.includes(-1)) return done(null, false, {message: permanentBanMessage})
            if (user.roles.includes(-2)) return done(null, false, {message: temporaryBanMessage})
            if (!await bcrypt.compare(password, user.password)) return done(null, false, {message: invalidMessage})

            return done(null, user, { message: 'Welcome back ' + user.name})

        } catch (err) {
            return done(err)
        }
    }
)