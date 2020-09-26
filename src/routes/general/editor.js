/* ---------------------------------------------------------------------------------------------- */
/*                                            REQUIRES                                            */
/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------- MongoDB (Database) ------------------------------------- */
const dbUtil = require('../../utils/dbUtil')                        // Database Util Module
const EditorSave = require('../../models/EditorSave')               // Schema: Editor Saves
/* -------------------------------------------- Util -------------------------------------------- */
const {renderCustomPage, renderErrorPage} = require('../../utils/pages')
const {readIXMeta,readLessonConfig, validateLessonPath} = require('../../utils/courses')

/* ---------------------------------------------------------------------------------------------- */
/*                                              ROUTE                                             */
/* ---------------------------------------------------------------------------------------------- */
module.exports = async (req, res) => {
    if (await validateLessonPath(req.params.course, req.params.chapter, req.params.lesson)) { // Makes sure the lesson is valid
        let user = null
        let editorSave = null
        let savedDocuments = null
        if (typeof req.session.passport != 'undefined' && req.session.passport !== null) {
            user = await dbUtil.users.getUserByUserID(req.session.passport.user)
            if (user != null) {
                editorSave = await dbUtil.editorSave.getSaveByUserIDAndCourse(user.userid, req.params.course)

                if (editorSave == null) {
                    let saveData = []
                    let courseInfo = await readIXMeta(req.params.course)

                    for (let i = 0; i < courseInfo.chapters.length; i++) {
                        saveData[i] = []
                        for (let j = 0; j < courseInfo.chapters[i].lessons.length; j++) {
                            saveData[i][j] = {
                                completed: false,
                                data: []
                            }
                        }
                    }

                    await EditorSave.create({ userid: user.userid, course: req.params.course, data: saveData })
                    editorSave = await dbUtil.editorSave.getSaveByUserIDAndCourse(user.userid, req.params.course)
                }
                savedDocuments = editorSave.data[Number.parseInt(req.params.chapter)][Number.parseInt(req.params.lesson)].data
            }
        }

        renderCustomPage(req, res, 'editor', {
            course: req.params.course,
            chapter: req.params.chapter,
            lesson: req.params.lesson,
            meta: JSON.stringify(await readIXMeta(req.params.course)),
            config: Buffer.from(JSON.stringify(await readLessonConfig(req.params.course, req.params.chapter, req.params.lesson))).toString('base64'),
            saves: savedDocuments || null
        })
    } else {
        renderErrorPage(req, res, 404, 'ERR_PAGE_NOT_FOUND', 'Seems like this page doesn\'t exist.', 'Not Found')
    }
}