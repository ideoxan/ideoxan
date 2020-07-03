const dbUtil = require("./dbUtil")

module.exports = {
    isAuth: (req, res, next) => { // Advances if the user is authenticated. Throws 403/404 if not
        if (!req.isAuthenticated()) {
            res.status(404)
            if (req.accepts('html')) {
                res.render('error', {errNum: 404, message: 'Seems like this page doesn\'t exist.', code: 'ERR_PAGE_NOT_FOUND'})
            } else if (req.accepts('json')) {
                res.json({error: 403, code: 'ERR_FORBIDDEN', message: 'Forbidden'}) //Done intentionally
            } else {
                res.send('Forbidden')
            }
        } else return next()
    },
    isNotAuth: (req, res, next) => { // Advances if the user is not authenticated. Throws 403/404 if not
        if (req.isAuthenticated()) {
            res.status(404)
            if (req.accepts('html')) {
                res.render('error', {errNum: 404, message: 'Seems like this page doesn\'t exist.', code: 'ERR_PAGE_NOT_FOUND'})
            } else if (req.accepts('json')) {
                res.json({error: 403, code: 'ERR_FORBIDDEN', message: 'Forbidden'})
            } else {
                res.send('Forbidden')
            }
        } else return next()
    },
    isAdmin: async (req, res, next) => { // Advances if the user is an admin. Throws 404 if not
        let user = await dbUtil.user.getUserByUserID(req.session.passport.user)
        if (user.roles.includes(1)) {
            return next()
        } else {
            res.status(404)
            if (req.accepts('html')) {
                res.render('error', {errNum: 404, message: 'Seems like this page doesn\'t exist.', code: 'ERR_PAGE_NOT_FOUND'})
            }
        }
    }
}