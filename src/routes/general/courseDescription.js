/* ---------------------------------------------------------------------------------------------- */
/*                                            REQUIRES                                            */
/* ---------------------------------------------------------------------------------------------- */
/* -------------------------------------------- Util -------------------------------------------- */
const {renderCustomPage} = require('../../utils/pages')
const {readIXMeta, validateLessonPath} = require('../../utils/courses')
const { HTTPErrorPage } = require("../../utils/HTTPErrors")

/* ---------------------------------------------------------------------------------------------- */
/*                                              ROUTE                                             */
/* ---------------------------------------------------------------------------------------------- */
module.exports = async (req, res) => {
    if (await validateLessonPath(req.params.course)) {
        let meta = await readIXMeta(req.params.course)

        return renderCustomPage(req, res, 'coursedescription', { meta: meta })
    } else {
        let responseError = new HTTPErrorPage(req, res, '404')
        return responseError.renderPage()
    }
}