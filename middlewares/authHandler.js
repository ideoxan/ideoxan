const Users = require(serverConfig.paths.models + '/User')
const localAuth = require(serverConfig.paths.middleware + '/localAuth')

module.exports = (passport) => {
    passport.use('local', localAuth)

    passport.serializeUser((user, done) => {
        // Fun fact ^ ... the user object is an acutal db object

        // User streaks
        let lastLogin = new Date(user.lastLogin) // Gets the last login date
        let currentLogin = new Date() // Gets the current login date

        // Computes deltas
        let deltaDays = currentLogin.getDate() - lastLogin.getDate() // Delta days
        let deltaMonths = currentLogin.getMonth() - lastLogin.getMonth() // Delta months
        let deltaYears = currentLogin.getFullYear() - lastLogin.getFullYear() // Delta years

        // If there is no change in months and years, and days diff is equal to 1...
        if (deltaMonths == 0 && deltaYears == 0 && deltaDays == 1) {
            user.loginStreak++ // Increase the login streak
        } else {
            user.loginStreak = 0 // Otherwise reset it
        }

        user.lastLogin = currentLogin // Set the login date
        user.save() // Save
        
        done(null, user.uid) // Serialize
    })

    passport.deserializeUser((uid, done) => {
        done(null, Users.findOne({uid: uid})) // Deserialize 
    })
}