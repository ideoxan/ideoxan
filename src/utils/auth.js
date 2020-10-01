const dbUtil = require("./dbUtil")
const { HTTPErrorPage } = require("./HTTPErrors")

module.exports = {
    isAuth: (req, res, next) => { // Advances if the user is authenticated. Throws 401 if not
        if (!req.isAuthenticated()) {
            let responseError = new HTTPErrorPage(req, res, '401')
            return responseError.renderPage()
        } else return next()
    },
    isNotAuth: (req, res, next) => { // Advances if the user is not authenticated. Throws 401 if not
        if (req.isAuthenticated()) {
            let responseError = new HTTPErrorPage(req, res, '401')
            return responseError.renderPage()
        } else return next()
    },
    isAdmin: async (req, res, next) => { // Advances if the user is an admin. Throws 403 if not
        if (!req.isAuthenticated()) {
            let responseError = new HTTPErrorPage(req, res, '403')
            return responseError.renderPage()
        }
        let user = await dbUtil.users.getUserByUserID(req.session.passport.user)
        if (user.roles.includes(1)) {
            return next()
        } else {
            let responseError = new HTTPErrorPage(req, res, '403')
            return responseError.renderPage()
        }
    }
}