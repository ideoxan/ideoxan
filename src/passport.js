const passport = require('passport')
const LS = require('passport-local').Strategy
const dbUtil = require('./dbUtil')

const bcrypt = require('bcryptjs')

module.exports = async function init(passport) {
    passport.use(new LS({usernameField: 'email'}, async (email, password, done) => {
        try {
            const user = await dbUtil.user.getUserByEmail(email)
            if (user == null) return done(null, false, {message: 'Email or Password is incorrect'})

            if (user.roles.includes(2)) return done(null, false, {message: 'User has been permanently banned'})

            if (await bcrypt.compare(password, user.password)) {
                return done(null, user, {message: 'Signed in Successfully'})
            } else {
                return done(null, false, {message: 'Email or Password is incorrect'})
            }
        } catch (err) {
            return done(err)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user.userid)
    })

    passport.deserializeUser((userid, done) => {
        done(null, dbUtil.user.getUserByUserID(userid))
    })
}