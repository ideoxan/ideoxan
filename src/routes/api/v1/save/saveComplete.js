/* ---------------------------------------------------------------------------------------------- */
/*                                              SPEC                                              */
/* ---------------------------------------------------------------------------------------------- */
// > COMPLETE
// Sets the completion status of a user's lesson save

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
        let user = null
        let editorSave = null
        if (typeof req.session.passport != 'undefined' && req.session.passport !== null) {
            user = await dbUtil.users.getUserByUserID(req.session.passport.user)
            if (user != null) {
                editorSave = await dbUtil.editorSave.getSaveByUserIDAndCourse(user.userid, req.params.course)

                if (editorSave == null) {
                    return res.status(403).end()
                }
                if (typeof editorSave.data[Number.parseInt(req.params.chapter)] == 'undefined')
                    return res.status(403).end()

                if (typeof editorSave.data[Number.parseInt(req.params.chapter)][Number.parseInt(req.params.lesson)] == 'undefined') {
                    return res.status(403).end()
                } else {
                    editorSave.data[Number.parseInt(req.params.chapter)][Number.parseInt(req.params.lesson)].completed = true
                    editorSave.markModified('data')
                    await editorSave.save()
                    return res.status(200).end()
                }
            } else {
                let responseError = new HTTPErrorPage(req, res, '404')
                return responseError.renderPage()
            }
        }
    } catch (err) {
        console.log(err.stack)
        let responseError = new HTTPErrorPage(req, res, '500')
        return responseError.renderPage()
    }
}