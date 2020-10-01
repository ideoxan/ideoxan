/* ---------------------------------------------------------------------------------------------- */
/*                                              SPEC                                              */
/* ---------------------------------------------------------------------------------------------- */
// > DELETE
// Deletes a user and their associated information

/* ---------------------------------------------------------------------------------------------- */
/*                                            REQUIRES                                            */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------- MongoDB (Database) ------------------------------------- */
const dbUtil = require('../../../../utils/dbUtil')              // Database Util Module
const { HTTPErrorPage } = require("../../../../utils/HTTPErrors")

/* ---------------------------------------------------------------------------------------------- */
/*                                              ROUTE                                             */
/* ---------------------------------------------------------------------------------------------- */
module.exports = async (req, res) => {
    try {
        let user = await dbUtil.users.getUserByUserID(req.session.passport.user) || null
        if (user) {
            await user.deleteOne()
            req.logOut()
            if (req.session) req.session.destroy()
            if (req.accepts('html')) {
                res.redirect('/')
            }
        }
    } catch (err) {
        console.log(err.stack)
        let responseError = new HTTPErrorPage(req, res, '500')
        return responseError.renderPage()
    }
}