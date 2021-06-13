/* ---------------------------------------------------------------------------------------------- */
/*                                             MODULES                                            */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------- Models ------------------------------------------- */
const Users                     = require(serverConfig.paths.models + '/User')
const Verification              = require(serverConfig.paths.models + '/Verification')

/* ------------------------------------------ Utilities ----------------------------------------- */
const render                    = require(serverConfig.paths.utilities + '/render')
const randomNumber              = require('random-number-csprng')
const mailgun                   = require('mailgun-js')
const c = require('chalk')



/* ---------------------------------------------------------------------------------------------- */
/*                                         INITIALIZATION                                         */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------ Endpoint ------------------------------------------ */
exports.route = 'verify/ix/email'

/* ------------------------------------------- Mailing ------------------------------------------ */
const mg = mailgun({
    apiKey: process.env.MAIL_KEY,
    domain: process.env.MAIL_DOMAIN
})



/* ---------------------------------------------------------------------------------------------- */
/*                                           CONTROLLER                                           */
/* ---------------------------------------------------------------------------------------------- */
exports.get = async (req, res, next) => {
    try {
        let email = req.query.email || null
        let uid = req.query.uid || null
        let displayName

        if (!email) return next()
        if (!uid) return next()

        let user = await Users.findOne({uid: uid, email: email})|| null
        let verificationEntry = await Verification.findOne({uid: uid, email: email}) || null

        if (!user) return next()
        let userObject = user.toObject()
        displayName = userObject.name
        if (user.verifiedEmail) return next()
        if (verificationEntry) {
            if (verificationEntry.toObject().expires < new Date()) {
                verificationEntry.deleteOne()
                let code = await generateNewCode()
                await Verification.create({
                    uid: uid,
                    email: email,
                    code: code
                })
                await sendEmail(email, displayName, code)
            }
        } else {
            let code = await generateNewCode()
            await Verification.create({
                uid: uid,
                email: email,
                code: code
            })
            await sendEmail(email, displayName, code)
        }
        await render('verify')(req, res, next)

    } catch (err) {
        next(err)
    }
}



/* ---------------------------------------------------------------------------------------------- */
/*                                             METHODS                                            */
/* ---------------------------------------------------------------------------------------------- */
async function generateNewCode () {
    let numArray = []
    for (let i=0;i<6;i++) {numArray += await randomNumber(0,9)}
    return numArray.toString()
}

async function sendEmail (email, displayName, code) {
    let htmlBody = `
    <div style="background: #F3F4F6; color: #111827; padding: 12px 24px 12px; text-align: center; font-family: Gilroy, Arial, sans-serif; height: min-content; width: auto">
        <div style="background: #F9FAFB; padding: 32px 48px 52px; width: 480px; margin: 12px auto; border-radius:12px; -webkit-box-shadow: 0px 0px 15px -10px rgba(17,24,39,0.4); -moz-box-shadow: 0px 0px 15px -10px rgba(17,24,39,0.4); box-shadow: 0px 0px 15px -10px rgba(17,24,39,0.4);">
            <p><img src="https://ideoxan.com/static/img/ix_primary_p.png" width="50px" style="margin: 0 0 12px;"></p>
            <p><strong><span style="color: #6d28d9;">Hey ${displayName},</span></strong></p>
            <p>We noticed that you are trying to log into Ideoxan. To ensure safety and security, we need for you to verify this email address.</p>
            <p>Please use the code below to continue</p>
            <p style="font-weight: bold; font-family: monospace; font-size: 48px; background-color: #F3F4F6; width: min-content; margin: 12px auto 4px; padding: 0px 12px; border: 2px #E5E7EB solid; border-radius: 4px">${code}</p>
        </div>
        <p style="font-size: 10px; width: 640px; margin: 12px auto;">
            <span style="color: #6B7280; ">Notice of Security: No representative for Ideoxan, any of its holdings/parent organizations/partners will ever ask you for potentially sensitive information like your password. If you believe that an actor is attempting to hijack your account, please inform us at </span><a href="mailto:hello@ideoxan.com" style="color: #6B7280;">hello@ideoxan.com</a>
        </p>
        <p style="font-size: 10px; margin: 24px auto; width: 640px;">
            <span style="color: #9CA3AF; font-weight: bold; text-decoration: none;"></span><a href="https://www.ideoxan.com" style="text-decoration: none; color: #9CA3AF; font-weight: bold;">Made with <3 by Ideoxan</a>
        </p>
    </div>
    `

    let mailData = {
        from: 'noreply <noreply@ideoxan.com>',
        to: email,
        subject: 'Your Ideoxan Email Verification Code',
        html: htmlBody
    }
    mg.messages().send(mailData, (err, body) => {
        if (err) console.error(err)
        console.log(logMail(email, body))
    })
}

function logMail(email, body) {
    const timestamp = c.grey(new Date().toISOString())
    const scope = c.bold('EMAIL')
    const method = 'OUTBOUND'
    const status = (body.message.includes('Queued.'))? 'QUEUED' : 'ERROR'
    const destination = email.split('@')[1]

    return `[${timestamp}] [${scope}] ${status} ${method} → ${destination}`
}