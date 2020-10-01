/* ---------------------------------------------------------------------------------------------- */
/*                                            REQUIRES                                            */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------- MongoDB (Database) ------------------------------------- */
const dbUtil = require('../../utils/dbUtil')                        // Database Util Module
/* -------------------------------------------- Util -------------------------------------------- */
const {renderCustomPage, renderErrorPage} = require('../../utils/pages')
const { HTTPErrorPage } = require("../../utils/HTTPErrors")

/* ---------------------------------------------------------------------------------------------- */
/*                                              ROUTE                                             */
/* ---------------------------------------------------------------------------------------------- */
module.exports = async (req, res) => {
    try {
        let user = await dbUtil.users.getUserByUserID(req.session.passport.user) || null
        if (user) {
            renderCustomPage(req, res, 'usersettings', { email: user.email, roles: user.roles, created: user.created })
        } else {
            renderCustomPage(req, res, 'usersettings')
        }
    } catch (err) {
        console.log(err.stack)
        let responseError = new HTTPErrorPage(req, res, '500')
        return responseError.renderPage()
    }
}