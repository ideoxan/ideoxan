/* ---------------------------------------------------------------------------------------------- */
/*                                             MODULES                                            */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------- Models ------------------------------------------- */
const Users                     = require(serverConfig.paths.models + '/User')
const Verification              = require(serverConfig.paths.models + '/Verification')
/* ------------------------------------------ Utilities ----------------------------------------- */
// HTTP Error Codes
const HTTPError                 = require(serverConfig.paths.utilities + '/HTTPError')



/* ---------------------------------------------------------------------------------------------- */
/*                                         INITIALIZATION                                         */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------ Endpoint ------------------------------------------ */
exports.route = 'user/verify/ix/email'


/* ---------------------------------------------------------------------------------------------- */
/*                                           CONTROLLER                                           */
/* ---------------------------------------------------------------------------------------------- */
exports.post = async (req, res, next) => {
    try {
        let email = req.query.email || null
        let uid = req.query.uid || null
        let v_code = req.body.v_code || null

        if (!email) return next()
        if (!uid) return next()
        if (!v_code) return next()

        email=email.toLowerCase()
        uid=uid.toLowerCase()

        let user = await Users.findOne({uid: uid, email: email})|| null
        let verificationEntry = await Verification.findOne({uid: uid, email: email}) || null

        if (!user) return next()
        let userObject = user.toObject()
        if (user.verifiedEmail) return next()
        if (!verificationEntry) return res.redirect(`/verify/ix/email?email=${email}&uid=${uid}`)

        verificationEntryObject = verificationEntry.toObject()

        if (verificationEntryObject.expires < new Date()) {
            await verificationEntry.deleteOne()
            req.flash('error', 'The code you entered has expired. A new email has been sent.')
            return res.redirect(`/verify/ix/email?email=${email}&uid=${uid}`)
        }

        if (verificationEntryObject.code == v_code 
            && userObject.uid == verificationEntryObject.uid
            && userObject.email == verificationEntryObject.email
            && verificationEntryObject.expires.setHours(0,0,0,0) <= new Date().setHours(0,0,0,0)) {
            
            user.verifiedEmail = true
            await user.save()
            await verificationEntry.deleteOne()
            
            req.login(user, (err) => {
                if (err) return next(err)

                return res.status(200).redirect('/app/home')
            })
            
        } else {
            req.flash('error', 'Invalid verification code')
            return res.redirect(`/verify/ix/email?email=${email}&uid=${uid}`)
        }
    } catch (err) {
        next(err)
    }
}