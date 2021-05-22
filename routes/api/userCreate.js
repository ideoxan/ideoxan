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
            await Users.create({
                email: req.body.email.toLowerCase(),
                username: req.body.username.toLowerCase(),
                name: req.body.username.toLowerCase(),
                password: pwdHash
            })
        })
        res.redirect('/login')
    } catch (err) {
        next(err)
    }
}