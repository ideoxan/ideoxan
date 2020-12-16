/* ---------------------------------------------------------------------------------------------- */
/*                                            REQUIRES                                            */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------------- General ------------------------------------------ */
const dbUtil = require('../utils/dbUtil')                       // Database Util Module
/* -------------------------------------------- Utils ------------------------------------------- */
const {getAvailableCourses} = require('../utils/courses')
const { HTTPErrorPage } = require('./HTTPErrors')

/* ---------------------------------------------------------------------------------------------- */
/*                                            CONSTANTS                                           */
/* ---------------------------------------------------------------------------------------------- */
let availableCourses 
(async () => availableCourses = await getAvailableCourses())()     // Gets all available courses

/* ---------------------------------------------------------------------------------------------- */
/*                                             EXPORTS                                            */
/* ---------------------------------------------------------------------------------------------- */
module.exports = {
    /**
     * Renders a page found in the specified views directory based on what was requested
     * @param {Request} req - A HTTP request
     * @param {Response} res - A HTTP response
     */
    renderPage: async (req, res) => {
        if (typeof req.session.passport != 'undefined' && req.session.passport !== null) {
            let user = await dbUtil.users.getUserByUserID(req.session.passport.user)
            res.render(req.path.substring(1), { auth: true, displayName: user.displayName, courses: await getAvailableCourses(), buildEnv: process.env.NODE_ENV })
        } else {
            res.render(req.path.substring(1), { auth: false, courses: await getAvailableCourses(), buildEnv: process.env.NODE_ENV })
        }
    },

    /**
     * Renders a page found in the specified views directory based on specified page.
     * @param {Request} req - A HTTP request
     * @param {Response} res - A HTTP response
     * @param {String} page - The name of a template page to render (independent from request)
     * @param {Object} data - Custom JSON data to feed to the rendering engine 
     */
    renderCustomPage: async (req, res, page, data = {}) => {
        try {
            if (typeof req.session != 'undefined' && typeof req.session.passport != 'undefined' && req.session.passport !== null) {
                let user = await dbUtil.users.getUserByUserID(req.session.passport.user)
                data.auth = user !== null
                if (data.auth) data.displayName = user.displayName
            } else {
                data.auth = false
            }
            data.cfg = {name: cfg.name, logoPath: cfg.logoPath}
            data.courses = await getAvailableCourses()
            data.buildEnv = process.env.NODE_ENV
            return res.render(page, data)
        } catch (err) {
            console.error(err.stack)
            let responseError = new HTTPErrorPage(req, res, '500')
            return responseError.renderPage()
        }

    },

    renderErrorPage: async (req, res, errNum, code, message, jsonMessage = null) => {
        if (!jsonMessage) jsonMessage = message // Can someone remove this line?
        res.status(errNum)
        if (req.accepts('html')) {
            res.render('error', { errNum: errNum, message: message, code: code, buildEnv: process.env.NODE_ENV })
        } else if (req.accepts('json')) {
            res.json({ error: errNum, code: code, message: jsonMessage })
        } else {
            res.send(jsonMessage)
        }
    }
}