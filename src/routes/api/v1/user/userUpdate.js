/* ---------------------------------------------------------------------------------------------- */
/*                                              SPEC                                              */
/* ---------------------------------------------------------------------------------------------- */
// > UPDATE
// Updates a specified user's information (email, password, display name, etc.)

/* ---------------------------------------------------------------------------------------------- */
/*                                            REQUIRES                                            */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------- MongoDB (Database) ------------------------------------- */
const dbUtil = require('../../../../utils/dbUtil')              // Database Util Module
/* -------------------------------------------- Auth -------------------------------------------- */
const bcrypt = require('bcryptjs')                              // User password hashing/comparison

/* ---------------------------------------------------------------------------------------------- */
/*                                              ROUTE                                             */
/* ---------------------------------------------------------------------------------------------- */
module.exports = async (req, res) => {
    try {
        let user = await dbUtil.users.getUserByUserID(req.session.passport.user) || null
        let updatedProperties = req.body || null
        let updatedPropertiesLength = Object.keys(updatedProperties).length || -1

        if (user && updatedProperties && updatedPropertiesLength > 0) {
            if (updatedProperties.displayName) {
                if (await dbUtil.users.getUserByDisplayName(updatedProperties.displayName)) {
                    req.flash('error', 'Username already taken')
                    return res.status(422).redirect('/settings')
                }
                user.displayName = updatedProperties.displayName
                user.markModified('displayName')
            }
            if (updatedProperties.password && updatedProperties.oldpassword) {
                if (await bcrypt.compare(updateddProperties.oldpassword, user.password)) {
                    user.password = await bcrypt.hash(req.body.password, Number.parseInt(process.env.PWD_HASH))
                    user.markModified('password')
                } else {
                    req.flash('error', 'Password is incorrect')
                    return res.status(422).redirect('/settings')
                }
            }
            if (updatedProperties.email && updatedProperties.oldemail) {
                if (user.email == updatedProperties.oldemail && !await dbUtil.users.getUserByEmail(updatedProperties.email)) {
                    user.email = updatedProperties.email
                    user.markModified('email')
                } else {
                    req.flash('error', 'Email is incorrect')
                    return res.status(422).redirect('/settings')
                }
            }
            await user.save()
            req.flash('success', 'Information updated successfully')
            res.status(200).redirect('/settings')
        } else {
            renderErrorPage(req, res, 422, 'ERR_BADENT', 'Unprocessable Entity')
        }
    } catch (err) {
        console.log(err.stack)
        renderErrorPage(req, res, 500, 'ERR_INTERNAL_SERVER', 'Looks like something broke on our side', 'Internal Server Error')
    }
}