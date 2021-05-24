/* ---------------------------------------------------------------------------------------------- */
/*                                             MODULES                                            */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------- Models ------------------------------------------- */
const Users                     = require(serverConfig.paths.models + '/User')
/* --------------------------------------- Authentication --------------------------------------- */
const passport                  = require('passport')
const bcrypt                    = require('bcryptjs')


/* ---------------------------------------------------------------------------------------------- */
/*                                         INITIALIZATION                                         */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------ Endpoint ------------------------------------------ */
exports.route = 'user/create/'


/* ---------------------------------------------------------------------------------------------- */
/*                                           CONTROLLER                                           */
/* ---------------------------------------------------------------------------------------------- */
exports.post = (req, res, next) => {
    try {
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