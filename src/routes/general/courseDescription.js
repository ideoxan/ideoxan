/* ---------------------------------------------------------------------------------------------- */
/*                                            REQUIRES                                            */
/* ---------------------------------------------------------------------------------------------- */
/* -------------------------------------------- Util -------------------------------------------- */
const {renderCustomPage} = require('../../utils/pages')
const {readIXMeta, validateLessonPath} = require('../../utils/courses')

/* ---------------------------------------------------------------------------------------------- */
/*                                              ROUTE                                             */
/* ---------------------------------------------------------------------------------------------- */
module.exports = async (req, res) => {
    if (await validateLessonPath(req.params.course)) {
        let meta = await readIXMeta(req.params.course)

        return renderCustomPage(req, res, 'coursedescription', { meta: meta })
    } else {
        renderErrorPage(req, res, 404, 'ERR_PAGE_NOT_FOUND', 'Seems like this page doesn\'t exist.', 'Not Found')
    }
}